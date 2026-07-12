/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan every HTML page (top-level + blog) so the JIT compiler emits exactly
  // the utility classes the site actually uses. Mirrors the old Play CDN output.
  content: [
    './*.html',
    './blog/*.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
