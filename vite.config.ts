import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const INPUT = process.env.INPUT;
if (!INPUT) throw new Error("INPUT environment variable is not set");

export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    rollupOptions: {
      input: INPUT,
      // marp-core is loaded from CDN at runtime to keep bundle size small
      external: ["@marp-team/marp-core"],
      output: {
        paths: {
          "@marp-team/marp-core": "https://esm.sh/@marp-team/marp-core@4.3.0",
        },
      },
    },
    outDir: "build",
    emptyOutDir: false,
    minify: true,
  },
});
