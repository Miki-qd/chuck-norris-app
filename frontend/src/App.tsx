import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const requestData = { email, password };

  const [joke, setJoke] = useState<string>("Preparing a joke...");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [impersonateName, setImpersonateName] = useState<string>("");

  const [activeTab, setActiveTab] = useState<'random' | 'myJokes' | 'addJoke'>('random');
  const [savedJokes, setSavedJokes] = useState<any[]>([]);

  const [customJoke, setCustomJoke] = useState<string>("");

  const fetchMyJokes = () => {
    fetch(`http://localhost:3000/jokes/${user.email}`)
      .then((res) => res.json())
      .then((data) => setSavedJokes(data))
      .catch(() => console.log('Error fetching saved jokes'));
  };

  const deleteJoke = (id: number) => {
    // Send delete request to backend
    fetch(`http://localhost:3000/jokes/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          // If successful, filter the list in memory
          // so the joke disappears from the screen immediately, without refreshing the page!
          setSavedJokes(savedJokes.filter((joke) => joke.id !== id));
        } else {
          alert('Error while deleting joke.');
        }
      })
      .catch(() => alert('Server connection error.'));
  };

  useEffect(() => {
    if (activeTab === 'myJokes') {
      fetchMyJokes();
    }
  }, [activeTab]);

  useEffect(() => {
    if (user) {
      fetch("https://api.chucknorris.io/jokes/categories")
        .then((res) => res.json())
        .then((data) => setCategories(data));

      fetchJoke();
    }
  }, [user]);

  const fetchJoke = () => {
    let url = "https://api.chucknorris.io/jokes/random";

    if (selectedCategory) {
      url += `?category=${selectedCategory}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let fetchedJoke = data.value;

        // Impersonacja
        if (impersonateName.trim() !== "") {
          fetchedJoke = fetchedJoke.replace(/Chuck Norris/gi, impersonateName);
        }

        setJoke(fetchedJoke);
      });
  };

  // --- SAVE JOKE FUNCTION ---
  const saveJoke = () => {
    // Guard: don't save empty text or a joke while it's loading
    if (!joke || joke === 'Preparing a joke...') {
      alert('Wait for a joke to be drawn!');
      return; 
    }

    // Pack the joke and the logged-in user's email
    const payload = {
      email: user.email, 
      jokeText: joke
    };

    // Send the package to the backend
    fetch('http://localhost:3000/jokes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          alert('Success! Joke added to your collection.');
        } else {
          alert('Failed to save joke.');
        }
      })
      .catch(() => alert('Server connection error.'));
  };

  // --- SAVE CUSTOM JOKE FUNCTION ---
  const saveCustomJoke = () => {
    if (!customJoke || customJoke.trim() === '') {
      alert('Please type a joke first!');
      return;
    }

    const payload = {
      email: user.email, 
      jokeText: customJoke
    };

    fetch('http://localhost:3000/jokes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          alert('Success! Custom joke added to your collection.');
          setCustomJoke('');
        } else {
          alert('Failed to save custom joke.');
        }
      })
      .catch(() => alert('Server connection error.'));
  };

  // Register function
  const handleRegister = (e: any) => {
    e.preventDefault();
    fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          alert("User has been added to the database!");
          setAuthMode("login");
          setPassword("");
        } else {
          alert("Error! User already exists in the database.");
        }
      })
      .catch(() => alert("Registration failed. Please try again."));
  };

  // Login function
  const handleLogin = (e: any) => {
    e.preventDefault();
    fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Invalid credentials");
      })
      .then((data) => {
        if (data && data.email) {
          alert("Login successful!");
        } else {
          throw new Error("Empty user object returned");
        }
        setUser(data);
      })
      .catch((error) => {
        if (error.message === "Invalid credentials") {
          alert("Wrong email or password!");
        } else {
          alert("An error occurred during login.");
        }
      });
  };

  return (
    <>
      {user ? (
        <div className="logged-in-view">
          <div className="choose-section">
            <aside className="sidebar">
              <div className="sidebar-logo">
                <img src="chuck.png" alt="Logo" />
              </div>
              <h2 className="title">Welcome, {user.email}!</h2>
              <nav className="sidebar-nav">
                <button className={`nav-item ${activeTab === 'random' ? 'active' : ''}`} onClick={() => setActiveTab('random')}>
                  RANDOM JOKE</button>
                <button className={`nav-item ${activeTab === 'myJokes' ? 'active' : ''}`} onClick={() => setActiveTab('myJokes')}>
                  MY JOKES</button>
                <button className={`nav-item ${activeTab === 'addJoke' ? 'active' : ''}`} onClick={() => setActiveTab('addJoke')}>
                  ADD JOKE</button>
              </nav>
              <div className="sidebar-footer">
                <button onClick={() => setUser(null)} className="nav-item">
                  LOG OUT
                </button>
                <p className="footer-text">made with Chuck by Chuck - 2024</p>
              </div>
            </aside>
          </div>

          <div className="joke-section">
  
  {/* --- TAB 1: RANDOM JOKES --- */}
  {activeTab === 'random' && (
    <div className="chuck-log">
      <img src="guns.jpg" alt="guns.jpg" id="guns" />
      <h2>Get your random joke!</h2>
      <p className="joke">"{joke}"</p>
      
      <div className="joke-inputs">
        <input 
          className='joke-inside' 
          type="text" 
          placeholder="Impersonate Chuck Norris" 
          value={impersonateName}
          onChange={(e) => setImpersonateName(e.target.value)}
        />
        
        <select 
          className='joke-inside' 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="joke-buttons">
        <button className="joke-button" id='joke-button-1' onClick={fetchJoke}>
          DRAW A JOKE
        </button>
        <button className="joke-button" id='joke-button-2' onClick={saveJoke}>
          SAVE JOKE
        </button>
      </div>
    </div>
  )}

  {activeTab === 'myJokes' && (
    <div className="main-content-inner">
      <h2 className="content-title my-jokes-title">My jokes list</h2>
      
      {savedJokes.length === 0 ? (
        <p>You don't have any saved jokes yet.</p>
      ) : (
        <ul className="jokes-list">
          {savedJokes.map((savedJoke, index) => (
            <li key={savedJoke.id} className="joke-list-item">
              <span className="joke-number">{index + 1}.</span>
              <span className="joke-list-text">"{savedJoke.jokeText}"</span>
              
              <button 
                className="delete-joke-btn" 
                onClick={() => deleteJoke(savedJoke.id)}
                title="Delete joke"
              >
                {/* Delete Icon (SVG) */}
                <svg className="delete-icon" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )}

  {/* --- TAB 3: ADD CUSTOM JOKE --- */}
  {activeTab === 'addJoke' && (
    <div className="chuck-log">
      <h2>Add a Custom Joke</h2>
      <div className="joke-inputs">
        <input 
          className='joke-inside' 
          type="text" 
          placeholder="Type your own joke here..." 
          value={customJoke}
          onChange={(e) => setCustomJoke(e.target.value)}
        />
      </div>
      <div className="joke-buttons">
        <button className="joke-button" id='joke-button-2' onClick={saveCustomJoke}>
          SAVE CUSTOM JOKE
        </button>
      </div>
    </div>
  )}

</div>
        </div>
      ) : (
        <div className="app-container">
          <div className="chuck-logo">
            <img src="chuck.png" alt="chuck-norris" />
          </div>
          <h2 className="title">
            {authMode === "login" ? "Login" : "Register"}
          </h2>

          <form
            onSubmit={authMode === "login" ? handleLogin : handleRegister}
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
              {authMode === "login" ? "Login" : "Register"}
            </button>
          </form>

          <div className="switch-container">
            {authMode === "login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setAuthMode("register")}
                  className="switch-button"
                >
                  Register
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setAuthMode("login")}
                  className="switch-button"
                >
                  Login
                </button>
              </p>
            )}
          </div>
          <p id="footer-text">
            "Chuck Norris can login without signup on any site"
          </p>
        </div>
      )}
    </>
  );
}

export default App;
