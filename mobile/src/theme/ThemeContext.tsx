import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, lightTheme, darkTheme } from "./theme";
import { ColorScheme } from "./colors";

const THEME_STORAGE_KEY = "@wordshelf_theme";

type ThemePreference = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  colorScheme: ColorScheme;
  themePreference: ThemePreference;
  toggleTheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setThemePreference: (pref: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "system") {
        setThemePreferenceState(saved);
      }
      setIsLoaded(true);
    });
  }, []);

  const colorScheme: ColorScheme =
    themePreference === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : themePreference;

  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const setThemePreference = (pref: ThemePreference) => {
    setThemePreferenceState(pref);
    AsyncStorage.setItem(THEME_STORAGE_KEY, pref);
  };

  const setColorScheme = (scheme: ColorScheme) => {
    setThemePreference(scheme);
  };

  const toggleTheme = () => {
    const newScheme = colorScheme === "light" ? "dark" : "light";
    setThemePreference(newScheme);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorScheme,
        themePreference,
        toggleTheme,
        setColorScheme,
        setThemePreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
