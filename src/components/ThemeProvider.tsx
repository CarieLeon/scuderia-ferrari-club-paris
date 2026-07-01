"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "sfc-theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Source de vérité du thème. Le thème par défaut est "dark" (identité de marque).
 * La classe `.dark` est posée sur <html> par le script anti-flash dans le layout
 * AVANT le paint ; ce provider ne fait que synchroniser l'état React et persister
 * les changements explicites de l'utilisateur.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  // Aligne l'état React ET la classe DOM sur le choix mémorisé. Le script
  // anti-flash pose déjà la classe avant le paint sur les pages normales ;
  // ce ré-alignement couvre les cas où il ne s'exécute pas (ex. le shell
  // d'erreur `__next_error__` d'un notFound() de route dynamique).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      const initial: Theme =
        stored === "light" || stored === "dark" ? stored : "dark";
      setThemeState(initial);
      document.documentElement.classList.toggle("dark", initial === "dark");
    } catch {
      /* localStorage indisponible — on garde le défaut "dark" */
    }
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* no-op */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", next === "dark" ? "#0d0d0d" : "#ffffff");
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme doit être utilisé dans <ThemeProvider>");
  return ctx;
}
