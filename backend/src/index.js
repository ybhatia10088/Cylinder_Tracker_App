const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.get("/", (req, res) => {
  res.send("API is running");
});

//  Auth Route
app.post("/auth", async (req, res) => {
  console.log(" Incoming /auth request:", req.body); // Debug

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Access code is required." });
  }

  try {
    const result = await pool.query(
      "SELECT branch_id FROM access_codes WHERE code = $1 AND active = TRUE",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid or inactive access code." });
    }

    res.status(200).json({ branchId: result.rows[0].branch_id });
  } catch (err) {
    console.error(" Auth error:", err);
    res.status(500).json({ message: "Server error during authentication." });
  }
});

// Get all branches
app.get("/branches", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM branches ORDER BY name");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(" Error fetching branches:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get cylinder records
app.get("/records", async (req, res) => {
  const { branchId, date } = req.query;

  if (!branchId || !date) {
    return res.status(400).json({error: "Missing branchId or date" });
  }

  try {
    const result = await pool.query(
      `SELECT 
         ir.type_id AS "typeId",
         ct.label,
         ir.full_count AS "fullCount",
         ir.empty_count AS "emptyCount"
       FROM inventory_records ir
       JOIN cylinder_types ct ON ir.type_id = ct.id
       WHERE ir.branch_id = $1 AND ir.week_ending = $2`,
      [branchId, date]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(" GET /records error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get cylinder types for a branch
app.get("/cylinder-types", async (req, res) => {
  const { branchId, group } = req.query;

  if (!branchId) {
    return res.status(400).json({ error: "Missing branchId" });
  }
  
  try {
    let query = `
      SELECT ct.id, ct.label, cg.name AS group
      FROM branch_cylinder_types bct
      JOIN cylinder_types ct ON bct.type_id = ct.id
      JOIN cylinder_groups cg ON ct.group_id = cg.id
      WHERE bct.branch_id = $1
    `;
    const params = [branchId];

    if (group) {
      query += " AND cg.name = $2";
      params.push(group);
    }

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(" Error fetching cylinder types:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// route to submit data
app.post("/records", async (req, res) => {
  const { branchId, records } = req.body;

  // Step 1: Basic validation
  if (!branchId || !Array.isArray(records)) {
    return res.status(400).json({ error: "branchId and records array are required" });
  }

  // Step 2: Validate each record
  for (let record of records) {
    const { typeId, weekEnding, fullCount, emptyCount } = record;

    if (!typeId || !weekEnding || fullCount == null || emptyCount == null) {
      return res.status(400).json({ error: "Missing required fields in one of the records" });
    }

    if (fullCount < 0 || emptyCount < 0) {
      return res.status(400).json({ error: "Counts must be 0 or greater" });
    }
  }

  // Step 3: Insert records into DB
  try {
    const insertResults = [];

    for (let record of records) {
      const { typeId, weekEnding, fullCount, emptyCount } = record;

      try {
        const result = await pool.query(
          `INSERT INTO inventory_records (branch_id, type_id, week_ending, full_count, empty_count)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [branchId, typeId, weekEnding, fullCount, emptyCount]
        );
        insertResults.push(result.rows[0]);

      } catch (err) {
        if (err.code === '23505') { // duplicate key violation
          return res.status(409).json({ error: `Duplicate entry for typeId ${typeId} on ${weekEnding}` });
        } else {
          console.error("DB Insert error:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
      }
    }

    return res.status(201).json({ message: "Records saved successfully", data: insertResults });

  } catch (err) {
    console.error(" Unexpected error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


//  Optional: Keep connection alive in dev (every 4 min)
setInterval(() => {
  pool.query("SELECT 1").catch(() => {});
}, 1000 * 60 * 4);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

