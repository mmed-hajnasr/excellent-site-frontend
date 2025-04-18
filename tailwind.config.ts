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
          '50': '#f4f3ff',
          '100': '#eceafd',
          '200': '#dbd7fd',
          '300': '#c0b7fb',
          '400': '#8f78f5',
          '500': '#8361f1',
          '600': '#713fe8',
          '700': '#632dd4',
          '800': '#5225b2',
          '900': '#452191',
          '950': '#2a1362'
        }
      }
    }
  },
  // plugins: [flowbitePlugin]
} as Config;
