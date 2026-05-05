import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            external: [
                "@interopio/insights-base",
                "@interopio/insights-metrics",
                "@interopio/insights-traces"
            ]
        }
    },
    resolve: {
        alias: {
            "@interopio/browser": fileURLToPath(new URL("./shims/interopio-browser.ts", import.meta.url))
        }
    },
    server: {
        port: 3001
    }
})
