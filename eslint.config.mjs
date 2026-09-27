import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

/** Flat ESLint config for the TanStack Start app-builder template. */
export default tseslint.config(
  {
    ignores: [
      "dist/**",
      ".output/**",
      ".vercel/**",
      ".nitro/**",
      "node_modules/**",
      "src/routeTree.gen.ts",
      // Vendor / generated browser assets — not app source.
      "public/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // eslint-plugin-react-hooks v7 flat recommended (React Compiler rules).
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    ...reactHooks.configs.flat.recommended,
  },
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          // Shared presentational helpers colocated with UI components.
          allowExportNames: [
            "money",
            "stanceClass",
            "callStanceClass",
            "convictionClass",
            "bannerTone",
            "callTone",
            "callHeadline",
            "rainGmBurst",
            "gmRainActive",
            "downloadOssPdf",
            "downloadMorningPdf",
            "isOutgoingCli",
          ],
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  // Disable rules that conflict with Prettier formatting.
  prettier,
);
