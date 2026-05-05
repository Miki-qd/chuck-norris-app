import { motion } from "framer-motion";

interface RandomJokeProps {
  joke: string;
  fetchJoke: () => void;
  saveJoke: () => void;
  impersonateName: string;
  setImpersonateName: (name: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

const RandomJoke = ({
  joke,
  fetchJoke,
  saveJoke,
  impersonateName,
  setImpersonateName,
  selectedCategory,
  setSelectedCategory,
  categories,
}: RandomJokeProps) => {
  return (
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
  );
};

export default RandomJoke;
