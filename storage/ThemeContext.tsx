import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme, type ThemeColors } from '../constants/theme';
import {
  loadThemeMode,
  saveThemeMode,
  type ThemeMode,
} from './settingsStorage';

export type { ThemeMode };

type ThemeContextValue = {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  isLoaded: boolean;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
};

function resolveIsDark(
  themeMode: ThemeMode,
  systemScheme: ReturnType<typeof useColorScheme>,
): boolean {
  if (themeMode === 'dark') {
    return true;
  }

  if (themeMode === 'light') {
    return false;
  }

  return systemScheme === 'dark';
}

function ThemeEffects({
  isDark,
  colors,
}: {
  isDark: boolean;
  colors: ThemeColors;
}) {
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  const isDark = useMemo(
    () => resolveIsDark(themeMode, systemScheme),
    [themeMode, systemScheme],
  );

  const colors = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    loadThemeMode().then((mode) => {
      setThemeModeState(mode);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    void saveThemeMode(themeMode);
  }, [themeMode, isLoaded]);

  function setThemeMode(mode: ThemeMode) {
    setThemeModeState(mode);
  }

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDark,
        colors,
        isLoaded,
        setThemeMode,
      }}>
      <ThemeEffects isDark={isDark} colors={colors} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

export function getThemeModeLabel(mode: ThemeMode) {
  if (mode === 'system') {
    return 'System';
  }

  if (mode === 'dark') {
    return 'Dark';
  }

  return 'Light';
}

export { ThemeContext };
