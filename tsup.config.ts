import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"], // Keep this as ESM
  target: "esnext",
  outDir: "dist",
  clean: true,
  bundle: true,
  splitting: false,
  sourcemap: true,
  // Add this banner to shim require() for CJS dependencies
  banner: {
    js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    `,
  },
});






// import { defineConfig } from "tsup";

// export default defineConfig({
//   entry: ["src/server.ts"],
//   format: ["esm", "cjs"],
//   target: "esnext",
//   outDir: "dist",
//   clean: true,
//   bundle: true,
//   splitting: false,
//   sourcemap: true,
//   external: [
//     "@prisma/client",
//     "@prisma/client-runtime-utils",
//     ".prisma/client",
//   ],
//   // Only apply the createRequire shim to ESM output, not CJS
//   esbuildOptions(options, context) {
//     if (context.format === "esm") {
//       options.banner = {
//         js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
//       };
//     }
//   },
// });