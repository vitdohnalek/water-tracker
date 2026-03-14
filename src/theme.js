import React, { createContext, useContext, useState, useEffect } from "react";
import { getSettings, saveSetting } from "./utils/storage";

// Theme definitions
const THEMES = {
  dark: {
    name: "Dark",
    circle: "#0D1117",
    colors: {
      bg: "#0D1117",
      surface: "#161B22",
      surfaceLight: "#162235",
      highlight: "#1E3A5F",
      accent: "#5B9CF6",
      textPrimary: "#E6EDF3",
      textSecondary: "#8B949E",
      textMuted: "#6E7681",
      success: "#3FB950",
      successBg: "#0F2E1A",
      danger: "#F85149",
      dangerBg: "#3D1F20",
      progressBarBg: "#21262D",
    },
  },
  light: {
    name: "Light",
    circle: "#F6F8FA",
    colors: {
      bg: "#F6F8FA",
      surface: "#FFFFFF",
      surfaceLight: "#EEF2F7",
      highlight: "#D0D7DE",
      accent: "#0969DA",
      textPrimary: "#1F2328",
      textSecondary: "#656D76",
      textMuted: "#8C959F",
      success: "#1A7F37",
      successBg: "#DAFBE1",
      danger: "#CF222E",
      dangerBg: "#FFEBE9",
      progressBarBg: "#D8DEE4",
    },
  },
  pink: {
    name: "Pink",
    circle: "#F5D0E0",
    colors: {
      bg: "#FFF0F5",
      surface: "#FFE4EF",
      surfaceLight: "#FFD6E8",
      highlight: "#F0B0CC",
      accent: "#D4608A",
      textPrimary: "#4A1A32",
      textSecondary: "#7A3A5A",
      textMuted: "#A06080",
      success: "#2E9B5A",
      successBg: "#D8F5E3",
      danger: "#D43A3A",
      dangerBg: "#FFE0E0",
      progressBarBg: "#F0C8D8",
    },
  },
  dark_blue: {
    name: "Dark Blue",
    circle: "#0A1628",
    colors: {
      bg: "#0A1628",
      surface: "#112240",
      surfaceLight: "#1A2F50",
      highlight: "#233D5E",
      accent: "#64FFDA",
      textPrimary: "#CCD6F6",
      textSecondary: "#8892B0",
      textMuted: "#606A86",
      success: "#64FFDA",
      successBg: "#0F2E2A",
      danger: "#FF6B6B",
      dangerBg: "#3D1F20",
      progressBarBg: "#1A2F50",
    },
  },
  light_blue: {
    name: "Light Blue",
    circle: "#E8F4FD",
    colors: {
      bg: "#E8F4FD",
      surface: "#FFFFFF",
      surfaceLight: "#D6ECFA",
      highlight: "#B0D4F1",
      accent: "#1976D2",
      textPrimary: "#0D2137",
      textSecondary: "#4A6A8A",
      textMuted: "#7A9AB8",
      success: "#2E7D32",
      successBg: "#E0F2E1",
      danger: "#C62828",
      dangerBg: "#FFEBEE",
      progressBarBg: "#C0D8EE",
    },
  },
};

const THEME_KEYS = Object.keys(THEMES);
const DEFAULT_THEME = "dark";

// Fallback static colors (used before context loads)
const colors = THEMES.dark.colors;

// Context
const ThemeContext = createContext({
  colors: THEMES.dark.colors,
  themeKey: DEFAULT_THEME,
  setThemeKey: () => {},
});

const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKeyState] = useState(DEFAULT_THEME);

  useEffect(() => {
    const load = async () => {
      const settings = await getSettings();
      if (settings.theme && THEMES[settings.theme]) {
        setThemeKeyState(settings.theme);
      }
    };
    load();
  }, []);

  const setThemeKey = async (key) => {
    setThemeKeyState(key);
    await saveSetting("theme", key);
  };

  return (
    <ThemeContext.Provider
      value={{
        colors: THEMES[themeKey].colors,
        themeKey,
        setThemeKey,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { colors, THEMES, THEME_KEYS, DEFAULT_THEME, ThemeProvider, useTheme };
