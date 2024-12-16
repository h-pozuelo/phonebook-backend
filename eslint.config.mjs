import stylisticJs from "@stylistic/eslint-plugin-js";
import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["**/dist/"] },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    plugins: { "@stylistic/js": stylisticJs },
    rules: {
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": ["error", "unix"],
      "@stylistic/js/quotes": ["error", "single"],
      "@stylistic/js/semi": ["error", "never"],
      eqeqeq: "error",
      "@stylistic/js/no-trailing-spaces": "error",
      "@stylistic/js/object-curly-spacing": ["error", "always"],
      "@stylistic/js/arrow-spacing": ["error", { before: true, after: true }],
      "no-console": 0,
    },
  },
  { languageOptions: { globals: { ...globals.node } } },
  pluginJs.configs.recommended,
];
