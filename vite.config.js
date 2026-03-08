import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: true, // Needed for Bolt.new web container preview routing
        port: 5173
    }
})
