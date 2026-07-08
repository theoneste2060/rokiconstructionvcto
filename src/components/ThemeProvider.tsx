import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Server render and first client render both assume "dark" (the blocking
  // script in __root sets the real class before paint); after mount we sync
  // state to the stored preference. Never return null here — that would blank
  // the whole app in the server-rendered HTML.
  const [theme, setTheme] = useState<Theme>("dark");
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("roki-theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else {
      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
    setSynced(true);
  }, []);

  useEffect(() => {
    if (!synced) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("roki-theme", theme);
  }, [theme, synced]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}