import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default {
    plugins: [react()],
    server: {
        port: process.env.PORT
    },
    base: "./"
}