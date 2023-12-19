import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
  optimizeDeps: {
    include: ["socket.io-client", "react-router-dom"],
  },
});
