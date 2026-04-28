import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const requestData = { email, password };

  const [joke, setJoke] = useState<string>('Preparing a joke...');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [impersonateName, setImpersonateName] = useState<string>('');

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
        if (data && data.email) {
          alert('Login successful!');
        } else {
          throw new Error('Empty user object returned');
        }
        setUser(data);
      })
      .catch((error) => {
        if (error.message === 'Invalid credentials') {
          alert('Wrong email or password!');
        } else {
          alert('An error occurred during login.');
        }
      });
  };

  return (
    <div className="app-container">
      {user ? (
        <div className="logged-in-view">
          <h2 className="title">Welcome, {user.email}!</h2>
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
            
            
          <div className="input-group">
          <label className="label">E-mail</label>
          <input 
          className="input-field"
          type="email" 
          placeholder="Type your email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          />
          </div>
            

          <div className="input-group">
          <label className="label">Password</label>
          <input 
          className="input-field"
          type="password" 
          placeholder="Type your password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
             />
           </div>

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