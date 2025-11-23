import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

type Theme = 'light' | 'dark' | 'sunset' | 'ocean' | 'forest';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes = {
  light: {
    background: 'from-emerald-50 via-teal-50 to-cyan-50',
    card: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    primary: 'bg-emerald-600 hover:bg-emerald-700',
    border: 'border-gray-200',
  },
  dark: {
    background: 'from-gray-900 via-slate-900 to-zinc-900',
    card: 'bg-gray-800',
    text: 'text-gray-100',
    textSecondary: 'text-gray-400',
    primary: 'bg-emerald-600 hover:bg-emerald-700',
    border: 'border-gray-700',
  },
  sunset: {
    background: 'from-orange-100 via-pink-100 to-purple-100',
    card: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    primary: 'bg-orange-600 hover:bg-orange-700',
    border: 'border-orange-200',
  },
  ocean: {
    background: 'from-blue-100 via-cyan-100 to-teal-100',
    card: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    primary: 'bg-blue-600 hover:bg-blue-700',
    border: 'border-blue-200',
  },
  forest: {
    background: 'from-green-100 via-emerald-100 to-teal-100',
    card: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    primary: 'bg-green-600 hover:bg-green-700',
    border: 'border-green-200',
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    if (user) {
      loadUserTheme();
    }
  }, [user]);

  const loadUserTheme = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_preferences')
      .select('theme')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data?.theme) {
      setThemeState(data.theme as Theme);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);

    if (user) {
      const { error } = await supabase
        .from('user_preferences')
        .upsert(
          {
            user_id: user.id,
            theme: newTheme,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error('Error saving theme:', error);
      }
    }
  };

  const value = {
    theme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { themes };
export type { Theme };
