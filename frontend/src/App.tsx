import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  // Fetch saved jokes
  const fetchMyJokes = () => {
    fetch(`http://localhost:3000/jokes/${user.email}`)
      .then((res) => res.json())
      .then((data) => setSavedJokes(data))
      .catch(() => {});
  };

  // Delete a joke by ID
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
          toast.error('Error while deleting joke.');
        }
      })
      .catch(() => toast.error('Server connection error.'));
  };

  // Fetch jokes when 'myJokes' tab is opened
  useEffect(() => {
    if (activeTab === 'myJokes') {
      fetchMyJokes();
    }
  }, [activeTab]);

  // Fetch categories and initial joke when user logs in
  useEffect(() => {
    if (user) {
      fetch("https://api.chucknorris.io/jokes/categories")
        .then((res) => res.json())
        .then((data) => setCategories(data));

      fetchJoke();
    }
  }, [user]);

  // Fetch a random joke from the API
  const fetchJoke = () => {
    let url = "https://api.chucknorris.io/jokes/random";

    if (selectedCategory) {
      url += `?category=${selectedCategory}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let fetchedJoke = data.value;

        // Handle name impersonation by replacing "Chuck Norris" with the user's input
        if (impersonateName.trim() !== "") {
          fetchedJoke = fetchedJoke.replace(/Chuck Norris/gi, impersonateName);
        }

        setJoke(fetchedJoke);
      });
  };

  // Saves the currently displayed random joke to the user's collection
  const saveJoke = () => {
    // Guard: don't save empty text or a joke while it's loading
    if (!joke || joke === 'Preparing a joke...') {
      toast.error('Wait for a joke to be drawn!');
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
          toast.success('Success! Joke added to your collection.');
        } else {
          toast.error('Failed to save joke.');
        }
      })
      .catch(() => toast.error('Server connection error.'));
  };

  // Saves a manually entered custom joke to the user's collection
  const saveCustomJoke = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customJoke || customJoke.trim() === '') {
      toast.error('Please type a joke first!');
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
          toast.success('Success! Custom joke added to your collection.');
          setCustomJoke('');
        } else {
          toast.error('Failed to save custom joke.');
        }
      })
      .catch(() => toast.error('Server connection error.'));
  };

  // Handles user registration by sending credentials to the backend
  const handleRegister = (e: any) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          toast.success("User has been added to the database!");
          setAuthMode("login");
          setPassword("");
        } else {
          toast.error("Error! User already exists in the database.");
        }
      })
      .catch(() => toast.error("Registration failed. Please try again."));
  };

  // Handles user login and authenticates the session
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
          toast.success("Login successful!");
        } else {
          throw new Error("Empty user object returned");
        }
        setUser(data);
      })
      .catch((error) => {
        if (error.message === "Invalid credentials") {
          toast.error("Wrong email or password!");
        } else {
          toast.error("An error occurred during login.");
        }
      });
  };
  // Render UI
  return (
    <>
      <Toaster position="top-center" />
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="floating-theme-toggle"
        title="Toggle Dark Mode"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      {user ? (
        <div className="dashboard-layout">
          <div className="sidebar-container">
            <aside className="sidebar">
              <div className="sidebar-logo">
                <img src="joke-svgrepo-com.svg" alt="chuck-norris" className="chuck-img-log-in" />
              </div>
              <nav className="sidebar-nav">
                <button className={`nav-button ${activeTab === 'random' ? 'active' : ''}`} onClick={() => setActiveTab('random')}>
                  RANDOM JOKE</button>
                <button className={`nav-button ${activeTab === 'myJokes' ? 'active' : ''}`} onClick={() => setActiveTab('myJokes')}>
                  MY JOKES</button>
                <button className={`nav-button ${activeTab === 'addJoke' ? 'active' : ''}`} onClick={() => setActiveTab('addJoke')}>
                  ADD JOKE</button>
              </nav>
              <div className="sidebar-footer">
                <button onClick={() => setUser(null)} className="nav-button">
                  LOG OUT
                </button>
                <p className="footer-text">made with Chuck by Chuck - 2024</p>
              </div>
            </aside>
          </div>

          <div className="main-content">
            <AnimatePresence mode="wait">
              {/* Random jokes tab */}
              {activeTab === 'random' && (
                <motion.div
                  key="random"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="joke-display-container"
                >
                  <img src="guns.jpg" alt="guns.jpg" className="joke-image" />
                  <h1>Get your random joke!</h1>
                  <motion.p
                    key={joke}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="joke-text"
                  >
                    "{joke}"
                  </motion.p>

                  <div className="joke-controls">
                    <div className="form-group" id="group-1">
                      <label className="form-label">Impersonate</label>
                      <input
                        className='joke-input'
                        type="text"
                        placeholder="Impersonate Chuck Norris"
                        value={impersonateName}
                        onChange={(e) => setImpersonateName(e.target.value)}
                      />
                    </div>
                    <div className="form-group" id="group-2">
                      <label className="form-label">Categories</label>
                      <select
                        className='joke-input'
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
                  </div>

                  <div className="joke-actions">
                    <button className="action-button" id="joke-button-1" onClick={fetchJoke}>
                      DRAW A {impersonateName.trim() !== "" ? impersonateName.toUpperCase() : "CHUCK NORRIS"} JOKE
                    </button>
                    <button className="action-button" id="joke-button-2" onClick={saveJoke}>
                      SAVE THIS JOKE
                    </button>
                  </div>
                </motion.div>
              )}

              {/* My jokes tab */}
              {activeTab === 'myJokes' && (
                <motion.div
                  key="myJokes"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="jokes-list-container"
                >
                  <h2 className="section-title">My Collection</h2>

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
                </motion.div>
              )}

              {/* Add custom joke tab */}
              {activeTab === 'addJoke' && (
                <motion.div
                  key="addJoke"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="joke-display-container"
                >
                  <h2>Add a Custom Joke</h2>
            <form className="custom-joke-form" onSubmit={saveCustomJoke}>
              <div className="form-group">
                <label className="form-label">Your Custom Joke</label>
                <textarea
                  className="joke-input"
                  placeholder="Type your own joke here..."
                  value={customJoke}
                  onChange={(e) => setCustomJoke(e.target.value)}
                />
              </div>
              <button type="submit" className="action-button">
                SAVE CUSTOM JOKE
              </button>
            </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        // Login or Register
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

      )}
    </>
  );
}

export default App;
