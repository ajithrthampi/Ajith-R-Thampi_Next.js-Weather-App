import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        vsm: "360px",
        sm: "640px",
        md: "768px",
        slg: "960px",
        lg: "1024px",
        xl: "1280px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    function ({ addUtilities}:any) {
      addUtilities({
        '.scrollbar-hide': {
          /* For Firefox */
          'scrollbar-width': 'none',
          /* For Chrome, Safari, and Edge */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.scrollbar-thumb': {
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ffffff', // Customize the color
            borderRadius: '0.5rem',
          }
        },
        '.scrollbar-track': {
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#6b7280', // Customize the track color
            borderRadius: '0.5rem',
          }
        },
        '.scrollbar-thin': {
          '&::-webkit-scrollbar': {
            width: '0.25rem',
            height: '0.25rem'
          },
        },
      }, ['responsive']);
    }
  ],
};
export default config;
