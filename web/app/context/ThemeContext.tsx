"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { lightTheme, darkTheme, getTheme } from "@/app/theme/theme";
import type { Theme } from "@/app/theme/theme";
import type { ColorScheme } from "@/app/theme/colors";

const THEME_STORAGE_KEY = "@wordshelf_theme";

export type ThemePreference = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  colorScheme: ColorScheme;
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemColorScheme(): ColorScheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyColorScheme(scheme: ColorScheme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", scheme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>("system");
  const [systemScheme, setSystemScheme] = useState<ColorScheme>("light");
  const [mounted, setMounted] = useState(false);

  // Load saved preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as
      | ThemePreference
      | null;
    if (saved === "light" || saved === "dark" || saved === "system") {
      setThemePreferenceState(saved);
    }
    setSystemScheme(getSystemColorScheme());
    setMounted(true);
  }, []);

  // Listen to system preference changes when preference is "system"
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setSystemScheme(getSystemColorScheme());
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const colorScheme: ColorScheme =
    themePreference === "system" ? systemScheme : themePreference;

  const theme = useMemo(
    () => getTheme(colorScheme),
    [colorScheme],
  );

  // Apply class to <html> whenever resolved colorScheme changes
  useEffect(() => {
    if (!mounted) return;
    applyColorScheme(colorScheme);
  }, [mounted, colorScheme]);

  const setThemePreference = useCallback((pref: ThemePreference) => {
    setThemePreferenceState(pref);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, pref);
    }
    // Apply immediately so the UI updates on click (don't wait for re-render)
    const schemeToApply =
      pref === "system" ? getSystemColorScheme() : pref;
    applyColorScheme(schemeToApply);
  }, []);

  const setColorScheme = useCallback(
    (scheme: ColorScheme) => {
      setThemePreference(scheme);
    },
    [setThemePreference],
  );

  const toggleTheme = useCallback(() => {
    const next: ColorScheme = colorScheme === "light" ? "dark" : "light";
    setThemePreference(next);
  }, [colorScheme, setThemePreference]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      colorScheme,
      themePreference,
      setThemePreference,
      setColorScheme,
      toggleTheme,
    }),
    [
      theme,
      colorScheme,
      themePreference,
      setThemePreference,
      setColorScheme,
      toggleTheme,
    ],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
