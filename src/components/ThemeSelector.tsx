import { Palette } from 'lucide-react';
import { useTheme, Theme } from '../contexts/ThemeContext';

const themeOptions: Array<{ value: Theme; label: string; preview: string }> = [
  { value: 'light', label: 'Light', preview: 'bg-gradient-to-r from-emerald-50 to-teal-50' },
  { value: 'dark', label: 'Dark', preview: 'bg-gradient-to-r from-gray-900 to-slate-900' },
  { value: 'sunset', label: 'Sunset', preview: 'bg-gradient-to-r from-orange-100 to-pink-100' },
  { value: 'ocean', label: 'Ocean', preview: 'bg-gradient-to-r from-blue-100 to-cyan-100' },
  { value: 'forest', label: 'Forest', preview: 'bg-gradient-to-r from-green-100 to-emerald-100' },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        <Palette className="w-4 h-4" />
        <span>Theme</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`p-3 rounded-lg transition-all ${
              theme === option.value
                ? 'ring-2 ring-emerald-600 scale-105'
                : 'hover:scale-105'
            }`}
          >
            <div className={`h-12 ${option.preview} rounded mb-2`}></div>
            <p className="text-xs font-medium text-gray-900">{option.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
