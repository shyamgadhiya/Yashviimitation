import { useEffect, useState } from "react";
import { isDarkTheme, toggleTheme } from "../../lib/theme.js";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => isDarkTheme());

  useEffect(() => {
    setIsDark(isDarkTheme());
  }, []);

  const handleToggle = () => {
    const nextTheme = toggleTheme();
    setIsDark(nextTheme === "dark");
  };

  return (
    <button className="theme-toggle" onClick={handleToggle} title="Toggle dark/light mode" aria-label="Toggle theme">
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
