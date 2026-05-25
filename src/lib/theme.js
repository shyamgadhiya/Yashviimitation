export const THEME_KEY = "yi-theme";

export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || "light";
  } catch {
    return "light";
  }
}

export function applyTheme(theme, { persist = true } = {}) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.classList.toggle("dark", nextTheme === "dark");

  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch {
      // Ignore storage failures and keep UI responsive.
    }
  }

  return nextTheme;
}

export function initTheme() {
  return applyTheme(getStoredTheme(), { persist: false });
}

export function isDarkTheme() {
  return document.documentElement.classList.contains("dark");
}

export function toggleTheme() {
  return applyTheme(isDarkTheme() ? "light" : "dark");
}
