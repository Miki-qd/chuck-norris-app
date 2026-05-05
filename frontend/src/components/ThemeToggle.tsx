interface ThemeToggleProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

const ThemeToggle = ({ isDarkMode, setIsDarkMode }: ThemeToggleProps) => {
  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="floating-theme-toggle"
      title="Toggle Dark Mode"
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
