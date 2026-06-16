import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const IIS_BASE_PATH = "/relatos-de-papel/";

// https://vite.dev/config/
export default defineConfig({
  base: IIS_BASE_PATH,
  plugins: [react(), tailwindcss()],
});
