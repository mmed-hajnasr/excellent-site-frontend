import type { Config } from 'tailwindcss';
// import flowbitePlugin from 'flowbite/plugin'

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts,md}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        // flowbite-svelte
        primary: {
          50: '#FFF5F2',
          100: '#FFF1EE',
          200: '#FFE4DE',
          300: '#FFD5CC',
          400: '#FFBCAD',
          500: '#FE795D',
          600: '#9563c2', // main color dark
          700: '#542849', // main color light
          800: '#CC4522',
          900: '#A5371B'
        }
      }
    }
  },
  // plugins: [flowbitePlugin]
} as Config;
