import React from 'react';

interface AuthProps {
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleRegister: (e: React.FormEvent) => void;
}

const Auth = ({
  authMode,
  setAuthMode,
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  handleRegister,
}: AuthProps) => {
  return (
    <div className="auth-container">
      <div className="auth-logo">
        <img src="joke-svgrepo-com.svg" alt="chuck-norris" className="chuck-img-loggged-in" />
      </div>
      <h1 className="app-title">
        Explore "Chuck Jokes" with us!
      </h1>

      <form
        onSubmit={authMode === "login" ? handleLogin : handleRegister}
        className="auth-form"
      >
        <div className="form-group">
          <label className="form-label">E-mail</label>
          <input
            className="form-input"
            type="email"
            placeholder="Type your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Type your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <button type="submit" className="form-submit-button">
          {authMode === "login" ? "LOG IN" : "CREATE ACCOUNT"}
        </button>
      </form>

      <div className="auth-switch-container">
        {authMode === "login" ? (
          <p>
            Don't have an account?{" "}
            <button
              onClick={() => setAuthMode("register")}
              className="auth-switch-button"
            >
              Sing up here!
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              onClick={() => setAuthMode("login")}
              className="auth-switch-button"
            >
              Login in here!
            </button>
          </p>
        )}
      </div>
      <p className="auth-footer-text">
        "Chuck Norris can login without signing up, on any website"
      </p>
      <svg className="ct-svg-1" width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g fill="#EA3E85" transform="translate(50, 50) rotate(180) ">
          <circle cx="0" cy="0" r="9" />
          <circle cx="0" cy="-35" r="9" />
          <circle cx="0" cy="35" r="9" />
          <circle cx="-35" cy="0" r="9" />
          <circle cx="35" cy="0" r="9" />
          <polygon points="0,-18, -8,-32, 8,-32" transform="translate(0, 0) rotate(-45)" />
          <polygon points="0,-18, -8,-32, 8,-32" transform="translate(36, 0) rotate(-45)" />
          <polygon points="0,-18, -8,-32, 8,-32" transform="translate(36, 36) rotate(-45)" />
          <polygon points="0,-18, -8,-32, 8,-32" transform="translate(0, 36) rotate(-45)" />
        </g>
      </svg>
      <svg className="ct-svg-2" width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g fill="#EA3E85" transform="translate(50, 50) rotate(180) ">
          <circle cx="0" cy="0" r="9" />
          <circle cx="0" cy="-35" r="9" />
          <circle cx="0" cy="35" r="9" />
          <circle cx="-35" cy="0" r="9" />
          <circle cx="35" cy="0" r="9" />
          <polygon points="0,-18, -8,-32, 8,-32" transform="translate(0, 0) rotate(-45)" />
          <polygon points="0,-18, -8,-32, 8,-32" transform="translate(36, 0) rotate(-45)" />
          <polygon points="0,-18, -8,-32, 8,-32" transform="translate(36, 36) rotate(-45)" />
          <polygon points="0,-18, -8,-32, 8,-32" transform="translate(0, 36) rotate(-45)" />
        </g>
      </svg>
    </div>
  );
};

export default Auth;
