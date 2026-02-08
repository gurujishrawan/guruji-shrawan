"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "site-theme";

export function useTheme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
    const initial = stored || "light";
    setTheme(initial);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", initial);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => (current === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}
