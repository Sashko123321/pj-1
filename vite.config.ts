import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/pj-1/', // Перевір, щоб тут було саме так, з двома слешами
  plugins: [react()],
})git add .