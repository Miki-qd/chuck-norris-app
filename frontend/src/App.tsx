import { useState } from 'react';
import './App.css';

function App() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const requestData = { email, password };

  // Register function
  const handleRegister = (e: any) => {
    e.preventDefault();
    fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          alert('User has been added to the database!');
          setAuthMode('login');
          setPassword('');
        } else {
          alert('Error! User already exists in the database.');
        }
      })
      .catch(() => alert('Registration failed. Please try again.'));
  };

  // Login function
  const handleLogin = (e: any) => {
    e.preventDefault();
    fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Invalid credentials');
      })
      .then((data) => {
        setUser(data);
      })
      .catch(() => alert('Wrong email or password!'));
  };

  return (
    <div className="app-container">
      {user ? (
        <div className="logged-in-view">
          <h2>Welcome, {user.email}!</h2>
          <button onClick={() => setUser(null)} className="logout-button">
            Logout
          </button>
        </div>
      ) : (
        <>
          <h2 className="title">
            {authMode === 'login' ? 'Login' : 'Register'}
          </h2>

          <form
            onSubmit={authMode === 'login' ? handleLogin : handleRegister}
            className="register-form"
          >
            <input
              className="register-input"
              type="email"
              placeholder="Insert Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="register-input"
              type="password"
              placeholder="Insert Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="submit-button">
              {authMode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>

          <div className="switch-container">
            {authMode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthMode('register')}
                  className="switch-button"
                >
                  Register
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="switch-button"
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;