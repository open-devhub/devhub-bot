import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/events/**/*",
    "src/config/**/*",
    "src/utils/**/*",
  ],
  format: ["esm"],
  outDir: "dist",
  dts: true,
  minifyWhitespace: true,
  minifySyntax: true,
});
