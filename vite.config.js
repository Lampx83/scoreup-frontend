import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// export default defineConfig({
//   plugins: [react(), svgr()],
//    base: import.meta.env.BASE_URL || '/scoreup/',
//   resolve: {
//     alias: [
//       { find: '~', replacement: '/src' }
//     ]
//   }
// })

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [react(), svgr()],
    // base: env.VITE_BASE_URL || '/scoreup/',
    resolve: {
      alias: [{ find: "~", replacement: "/src" }],
    },
  });
};
