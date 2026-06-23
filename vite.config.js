import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/habit-tracker/',   // ← change this to your repo name
})git add vite.config.js
git commit -m "fix base path for GitHub Pages"
git push