/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Industrial Dark Palette
        zinc: {
          950: '#09090b', // Main BG
          900: '#18181b', // Panel BG
          850: '#202023', // Lighter Panel
          800: '#27272a', // Borders
        },
        // Semantic Colors
        status: {
          idle: '#94a3b8',    // Slate 400
          mapping: '#38bdf8', // Sky 400
          navigate: '#60a5fa',// Blue 400
          load: '#facc15',    // Yellow 400
          unload: '#fb923c',  // Orange 400
          obstacle: '#f87171',// Red 400
          charge: '#a3e635',  // Lime 400
          error: '#ef4444',   // Red 500
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
