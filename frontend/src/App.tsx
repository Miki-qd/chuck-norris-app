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

  // --- FUNKCJA ZAPISUJĄCA ŻART ---
  const saveJoke = () => {
    // Zabezpieczenie: nie zapisujemy pustego tekstu ani żartu w trakcie ładowania
    if (!joke || joke === 'Preparing a joke...') {
      alert('Poczekaj na wylosowanie żartu!');
      return; 
    }

    // Pakujemy żart oraz e-mail zalogowanego użytkownika (żeby wiedzieć, czyj to żart)
    const payload = {
      email: user.email, 
      jokeText: joke
    };

    // Wysyłamy paczkę na backend (endpoint, który za chwilę utworzymy w NestJS)
    fetch('http://localhost:3000/jokes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          alert('Sukces! Żart dodany do Twojej kolekcji.');
        } else {
          alert('Nie udało się zapisać żartu.');
        }
      })
      .catch(() => alert('Błąd połączenia z serwerem.'));
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
                <button className="nav-item">RANDOM JOKE</button>
                <button className="nav-item">MY JOKES</button>
                <button className="nav-item">ADD JOKE</button>
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
            <div className="chuck-log">
              <img src="guns.jpg" alt="guns.jpg" id="guns" />
              <h2 id="getr">Get your random Chuck Norris joke!</h2>
              <p className="joke">{joke}</p>
              <div className="joke-inputs">
                <input
                  value={impersonateName}
                  onChange={(e) => setImpersonateName(e.target.value)}
                  className="joke-inside"
                  type="text"
                  placeholder="Enter your name"
                />
                <select
                  className="joke-inside"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="joke-buttons">
                <button
                  onClick={fetchJoke}
                  className="joke-button"
                  id="joke-button-1"
                >
                  NEW JOKE
                </button>
                <button className="joke-button" id="joke-button-2" onClick={saveJoke}>
                  SAVE JOKE
                </button>
              </div>
            </div>
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
