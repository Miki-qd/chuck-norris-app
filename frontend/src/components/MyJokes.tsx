import { motion } from "framer-motion";

interface MyJokesProps {
  savedJokes: any[];
  deleteJoke: (id: number) => void;
}

const MyJokes = ({ savedJokes, deleteJoke }: MyJokesProps) => {
  return (
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
  );
};

export default MyJokes;
