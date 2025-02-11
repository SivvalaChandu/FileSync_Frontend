import { useState, useEffect } from "react";

const useDarkSide = () => {
  const [theme, setTheme] = useState(() => {
    // Initialize theme from localStorage or default to 'system'
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "system"
      ? savedTheme
      : "system";
  });

  const [systemPreference, setSystemPreference] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e) => {
      setSystemPreference(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  // Determine effective theme (either system preference or manual selection)
  const effectiveTheme = theme === "system" ? systemPreference : theme;
  const colorTheme = effectiveTheme === "dark" ? "light" : "dark";

  // Apply theme and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(colorTheme);
    root.classList.add(effectiveTheme);
    localStorage.setItem("theme", theme);
  }, [theme, effectiveTheme, colorTheme]);

  return [colorTheme, setTheme];
};

export default useDarkSide;
