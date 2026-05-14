import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import "./App.css";

// Components
import ThemeToggle from "./components/ThemeToggle";
import Auth from "./components/Auth";
import Sidebar from "./components/Sidebar";
import RandomJoke from "./components/RandomJoke";
import MyJokes from "./components/MyJokes";
import AddJoke from "./components/AddJoke";

function App() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (!user) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);
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
    fetch(`http://localhost:3000/jokes`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => setSavedJokes(data))
      .catch(() => {
        setUser(null); // auto logout if unauthorized
      });
  };

  // Delete a joke by ID
  const deleteJoke = (id: number) => {
    fetch(`http://localhost:3000/jokes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => {
        if (res.ok) {
          setSavedJokes(savedJokes.filter((joke) => joke.id !== id));
        } else {
          toast.error('Error while deleting joke.');
        }
      })
      .catch(() => toast.error('Server connection error.'));
  };

  // Fetch jokes when 'myJokes' tab is opened
  useEffect(() => {
    if (activeTab === 'myJokes' && user) {
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

        if (impersonateName.trim() !== "") {
          fetchedJoke = fetchedJoke.replace(/Chuck Norris/gi, impersonateName);
        }

        setJoke(fetchedJoke);
      });
  };

  // Saves the currently displayed random joke to the user's collection
  const saveJoke = () => {
    if (!joke || joke === 'Preparing a joke...') {
      toast.error('Wait for a joke to be drawn!');
      return;
    }

    const payload = {
      jokeText: joke
    };

    fetch('http://localhost:3000/jokes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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
      jokeText: customJoke
    };

    fetch('http://localhost:3000/jokes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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
  const handleRegister = (e: React.FormEvent) => {
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
  const handleLogin = (e: React.FormEvent) => {
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
        if (data && data.access_token) {
          toast.success("Login successful!");
          localStorage.setItem('token', data.access_token);
          const userData = { email: data.email };
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        } else {
          throw new Error("Invalid response from server");
        }
      })
      .catch((error) => {
        if (error.message === "Invalid credentials") {
          toast.error("Wrong email or password!");
        } else {
          toast.error("An error occurred during login.");
        }
      });
  };

  return (
    <>
      <Toaster position="top-center" />
      <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
      {user ? (
        <div className="dashboard-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} setUser={setUser} />

          <div className="main-content">
            <AnimatePresence mode="wait">
              {activeTab === 'random' && (
                <RandomJoke 
                  joke={joke} 
                  fetchJoke={fetchJoke} 
                  saveJoke={saveJoke}
                  impersonateName={impersonateName}
                  setImpersonateName={setImpersonateName}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  categories={categories}
                />
              )}

              {activeTab === 'myJokes' && (
                <MyJokes savedJokes={savedJokes} deleteJoke={deleteJoke} />
              )}

              {activeTab === 'addJoke' && (
                <AddJoke 
                  customJoke={customJoke} 
                  setCustomJoke={setCustomJoke} 
                  saveCustomJoke={saveCustomJoke} 
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <Auth 
          authMode={authMode} 
          setAuthMode={setAuthMode}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
        />
      )}
    </>
  );
}

export default App;
