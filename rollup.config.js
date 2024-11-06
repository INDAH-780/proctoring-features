// rollup.config.js
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.js",
  output: [
    { file: "dist/proctoring-library.cjs.js", format: "cjs" }, // CommonJS
    { file: "dist/proctoring-library.esm.js", format: "esm" }, // ES Module
    {
      file: "dist/proctoring-library.umd.js",
      format: "umd",
      name: "ProctoringLib",
    }, // UMD
  ],
  plugins: [terser()],
};
