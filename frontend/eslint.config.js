import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // ==========================================
  // Ignore generated / dependency files
  // ==========================================

  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
    ],
  },

  // ==========================================
  // JavaScript / JSX
  // ==========================================

  {
    files: ["**/*.{js,mjs,cjs,jsx}"],

    extends: [
      js.configs.recommended,
      pluginReact.configs.flat.recommended,
    ],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      // React 17+ / Vite automatic JSX transform
      "react/react-in-jsx-scope": "off",

      // We are using JavaScript instead of TypeScript/PropTypes.
      // Avoid forcing PropTypes on every component.
      "react/prop-types": "off",
    },
  },
]);