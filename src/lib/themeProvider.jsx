import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadJson, saveJson } from './storage';

const ThemeContext = createContext(null);
const THEMES = ['space-dust', 'aurora', 'storm', 'sunrise'];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => loadJson('cs_live_theme', 'aurora'));

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(...THEMES.map(t => `theme-${t}`));
    root.classList.add(`theme-${theme}`);
    saveJson('cs_live_theme', theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, themes: THEMES }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}


