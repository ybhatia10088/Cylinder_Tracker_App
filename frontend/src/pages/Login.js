import React, { useState } from 'react';

const IndustrialLoginPortal = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSplashClick = () => {
    setCurrentScreen('login');
  };

  const handleBack = () => {
    setCurrentScreen('splash');
    setAccessCode('');
  };

  const handleLogin = async () => {
    if (accessCode.trim()) {
      setIsLoading(true);
      // Simulate login process
      setTimeout(() => {
        setIsLoading(false);
        alert(`Access granted for code: ${accessCode}`);
      }, 1500);
    } else {
      alert('Please enter your access code');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="portal">
      <style jsx>{`
        .portal {
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
          overflow: hidden;
        }

        .splash-screen {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .splash-screen:hover {
          transform: scale(1.02);
        }

        .splash-screen::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 193, 7, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 87, 34, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, 0.03) 49%, rgba(255, 255, 255, 0.03) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(255, 255, 255, 0.03) 49%, rgba(255, 255, 255, 0.03) 51%, transparent 52%);
          background-size: 100px 100px, 120px 120px, 20px 20px, 20px 20px;
          opacity: 0.4;
        }

        .splash-screen::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.01) 2px,
              rgba(255, 255, 255, 0.01) 4px
            );
          pointer-events: none;
        }

        .logo-img {
          max-width: 250px;
          height: auto;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .company-tagline {
          color: #cccccc;
          font-size: 1.2rem;
          font-weight: 300;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .industry-text {
          color: #FF5722;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .continue-text {
          position: relative;
          z-index: 10;
          color: #ffffff;
          font-size: 1.3rem;
          font-weight: 400;
          margin-top: 3rem;
          padding: 1rem 2rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .continue-text:hover {
          background: rgba(255, 215, 0, 0.2);
          border-color: #FFD700;
          color: #FFD700;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);
        }

        .login-screen {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
        }

        .login-screen::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .back-button {
          position: absolute;
          top: 2rem;
          left: 2rem;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #ddd;
          border-radius: 50px;
          padding: 0.8rem 1.5rem;
          font-size: 0.95rem;
          color: #666;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .login-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.1),
            0 8px 25px rgba(0, 0, 0, 0.08);
          width: 100%;
          max-width: 420px;
          position: relative;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .login-logo {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .form-title {
          text-align: center;
          font-size: 1.8rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.8rem;
        }

        .form-subtitle {
          text-align: center;
          color: #777;
          margin-bottom: 2.5rem;
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .form-group {
          margin-bottom: 2rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.8rem;
          font-size: 1rem;
          letter-spacing: 0.05em;
        }

        .access-input {
          width: 100%;
          padding: 1.2rem 1.5rem;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 500;
          background: #fafbfc;
          transition: all 0.3s ease;
          letter-spacing: 0.1em;
        }

        .access-input:focus {
          outline: none;
          border-color: #FFD700;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.1);
        }

        .login-button {
          width: 100%;
          padding: 1.2rem;
          background: linear-gradient(135deg, #333333 0%, #000000 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          letter-spacing: 0.05em;
          position: relative;
          overflow: hidden;
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #000000 0%, #333333 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 1s ease-in-out infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .security-note {
          text-align: center;
          margin-top: 1.5rem;
          color: #888;
          font-size: 0.8rem;
          line-height: 1.4;
        }
      `}</style>

      {currentScreen === 'splash' ? (
        <div className="splash-screen" onClick={handleSplashClick}>
          <div className="logo-container">
            <img src="/assets/logo.jpg" alt="AWISCO Logo" className="logo-img" />
            <div className="company-tagline">Industrial Solutions</div>
            <div className="industry-text">• Welding • Construction • Manufacturing •</div>
          </div>
          <div className="continue-text">Click to Continue</div>
        </div>
      ) : (
        <div className="login-screen">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>

          <div className="login-card">
            <div className="login-logo">
              <img src="/assets/logo.jpg" alt="AWISCO Logo" className="logo-img" />
              <div className="login-subtitle">Secure Portal Access</div>
            </div>

            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">
              Enter your authorized access code to continue to the industrial management system
            </p>

            <div className="form-group">
              <label className="form-label">Access Code</label>
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                onKeyPress={handleKeyPress}
                className="access-input"
                placeholder="Enter your access code"
                autoFocus
                disabled={isLoading}
              />
            </div>

            <button 
              className="login-button" 
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading && <span className="loading-spinner"></span>}
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>

            <div className="security-note">
              This is a secure system. All access attempts are logged and monitored.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustrialLoginPortal;
