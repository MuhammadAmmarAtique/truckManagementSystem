// src/contexts/ThemeContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  ReactNode,
} from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { theme, darkTheme } from "@/theme/theme";

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useThemeContext must be used within CustomThemeProvider");
  return context;
};

interface Props {
  children: ReactNode;
}

export function CustomThemeProvider({ children }: Props) {
  const [darkMode, setDarkMode] = useState(false);

  const selectedTheme = useMemo(
    () => (darkMode ? darkTheme : theme),
    [darkMode]
  );

  return (
    <MuiThemeProvider theme={selectedTheme}>
      <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
        {children}
      </ThemeContext.Provider>
    </MuiThemeProvider>
  );
}
