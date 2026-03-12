import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { SelectModalTheme } from 'react-native-aura-select';

export interface ThemeColors {
  background: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  cardPressed: string;
  itemSelected: string;
  itemPressed: string;
}

/** Shadcn-style dark palette (zinc) */
const dark: ThemeColors = {
  background: '#09090b',
  card: '#18181b',
  border: '#27272a',
  text: '#fafafa',
  muted: '#a1a1aa',
  accent: '#3b82f6',
  cardPressed: '#27272a',
  itemSelected: '#27272a',
  itemPressed: '#3f3f46',
};

/** Shadcn-style light palette */
const light: ThemeColors = {
  background: '#fafafa',
  card: '#ffffff',
  border: '#e5e5e5',
  text: '#09090b',
  muted: '#71717a',
  accent: '#2563eb',
  cardPressed: '#f5f5f5',
  itemSelected: '#f4f4f5',
  itemPressed: '#f4f4f5',
};

function toModalTheme(colors: ThemeColors): SelectModalTheme {
  return {
    backgroundColor: colors.background,
    color: colors.text,
    borderColor: colors.border,
    secondaryColor: colors.muted,
    accentColor: colors.accent,
    itemPressedBackgroundColor: colors.itemPressed,
    itemSelectedBackgroundColor: colors.itemSelected,
  };
}

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
  modalTheme: SelectModalTheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const darkModalTheme = toModalTheme(dark);
const lightModalTheme = toModalTheme(light);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true); // default dark

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      toggleTheme,
      colors: isDark ? dark : light,
      modalTheme: isDark ? darkModalTheme : lightModalTheme,
    }),
    [isDark, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
