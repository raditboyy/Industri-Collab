/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warna khusus identitas PT Cetak Lagi
        'cetak-blue': '#2E3C8B',
        'lagi-red': '#D94841',
      },
    },
  },
  plugins: [],
};