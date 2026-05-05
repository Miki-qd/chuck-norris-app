import React from 'react';
import { motion } from "framer-motion";

interface AddJokeProps {
  customJoke: string;
  setCustomJoke: (joke: string) => void;
  saveCustomJoke: (e: React.FormEvent) => void;
}

const AddJoke = ({ customJoke, setCustomJoke, saveCustomJoke }: AddJokeProps) => {
  return (
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
  );
};

export default AddJoke;
