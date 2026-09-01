export interface ThemeColors {
  // Background colors
  bg: {
    primary: string;
    secondary: string;
    tertiary: string;
    hover: string;
  };
  // Text colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
  };
  // Border colors
  border: {
    primary: string;
    secondary: string;
    focus: string;
  };
  // Component specific
  sidebar: {
    bg: string;
    hover: string;
    active: string;
  };
  task: {
    bg: string;
    border: string;
    hover: string;
  };
  input: {
    bg: string;
    border: string;
    focus: string;
    placeholder: string;
  };
  modal: {
    bg: string;
    overlay: string;
  };
}

export const darkTheme: ThemeColors = {
  bg: {
    primary: '#0f1419',
    secondary: '#1a2332',
    tertiary: '#2a3f5f',
    hover: '#0f1419',
  },
  text: {
    primary: '#f3f4f6',    // gray-100
    secondary: '#d1d5db',  // gray-300
    tertiary: '#9ca3af',   // gray-400
    muted: '#6b7280',      // gray-500
  },
  border: {
    primary: '#374151',    // gray-700
    secondary: '#4b5563',  // gray-600
    focus: '#3b82f6',      // blue-500
  },
  sidebar: {
    bg: '#1a2332',
    hover: '#0f1419',
    active: '#2a3f5f',
  },
  task: {
    bg: '#1a2332',
    border: '#1f2937',     // gray-800
    hover: '#374151',      // gray-700
  },
  input: {
    bg: '#1a2332',
    border: '#374151',
    focus: '#3b82f6',
    placeholder: '#6b7280',
  },
  modal: {
    bg: '#1a2332',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
};

export const lightTheme: ThemeColors = {
  bg: {
    primary: '#ffffff',
    secondary: '#f9fafb',  // gray-50
    tertiary: '#e5e7eb',   // gray-200
    hover: '#f3f4f6',      // gray-100
  },
  text: {
    primary: '#111827',    // gray-900
    secondary: '#374151',  // gray-700
    tertiary: '#6b7280',   // gray-500
    muted: '#9ca3af',      // gray-400
  },
  border: {
    primary: '#d1d5db',    // gray-300
    secondary: '#e5e7eb',  // gray-200
    focus: '#3b82f6',      // blue-500
  },
  sidebar: {
    bg: '#f9fafb',
    hover: '#f3f4f6',
    active: '#e0e7ff',     // blue-100
  },
  task: {
    bg: '#ffffff',
    border: '#e5e7eb',
    hover: '#d1d5db',
  },
  input: {
    bg: '#ffffff',
    border: '#d1d5db',
    focus: '#3b82f6',
    placeholder: '#9ca3af',
  },
  modal: {
    bg: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.3)',
  },
};

export function getTheme(darkMode: boolean): ThemeColors {
  return darkMode ? darkTheme : lightTheme;
}
