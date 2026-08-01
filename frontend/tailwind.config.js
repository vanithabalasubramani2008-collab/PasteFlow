/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        workspace: {
          base: '#0D0D0D',     // Deepest background
          surface: '#1A1A1A',  // Panel background
          elevated: '#262626', // Popups/dropdowns
          border: '#333333'    // Thin borders
        },
        ide: {
          violet: '#8B5CF6',   // Primary actions, active focus
          emerald: '#10B981',  // Success, save states
          amber: '#F59E0B',    // Warnings, private states
          muted: '#A3A3A3',    // Unfocused text/icons
          text: '#E5E5E5'      // Primary text
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'panel': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        'float': '0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
