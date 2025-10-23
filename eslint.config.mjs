import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginImport from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      ".next/",
      "out/",
      "node_modules/",
      "app/middleware.*",
      "scripts/",
    ],
  },
  {
    files: ["next.config.js", "next-i18next.config.js", "postcss.config.js"],
    languageOptions: {
      globals: {
        module: "writable",
        process: "readonly",
        require: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginJsxA11y,
      import: pluginImport,
      prettier: pluginPrettier,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/prop-types": 0,
      "prettier/prettier": ["error"],
      "arrow-body-style": [2, "as-needed"],
      "class-methods-use-this": 0,
      "import/imports-first": 0,
      "import/newline-after-import": 0,
      "import/no-dynamic-require": 0,
      "import/no-extraneous-dependencies": 0,
      "import/no-named-as-default": 0,
      "import/no-unresolved": 2,
      "import/no-webpack-loader-syntax": 0,
      "import/prefer-default-export": 0,
      "jsx-a11y/aria-props": 2,
      "jsx-a11y/heading-has-content": 0,
      "jsx-a11y/label-has-associated-control": [
        2,
        {
          controlComponents: ["Input"],
        },
      ],
      "jsx-a11y/label-has-for": 0,
      "jsx-a11y/mouse-events-have-key-events": 2,
      "jsx-a11y/role-has-required-aria-props": 2,
      "jsx-a11y/role-supports-aria-props": 2,
      "max-len": 0,
      "newline-per-chained-call": 0,
      "no-confusing-arrow": 0,
      "no-console": 1,
      "no-unused-vars": 2,
      "no-use-before-define": 0,
      "prefer-template": 2,
      "react/destructuring-assignment": 0,
      "react-hooks/rules-of-hooks": "error",
      "react/jsx-closing-tag-location": 0,
      "react/jsx-props-no-spreading": 0,
      "react/forbid-prop-types": 0,
      "react/jsx-first-prop-new-line": [2, "multiline"],
      "react/jsx-filename-extension": 0,
      "react/jsx-no-target-blank": 0,
      "react/jsx-uses-vars": 2,
      "react/require-default-props": 0,
      "react/require-extension": 0,
      "react/self-closing-comp": 0,
      "react/sort-comp": 0,
      "require-yield": 0,
      "no-plusplus": [2, { allowForLoopAfterthoughts: true }],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
      react: {
        version: "detect",
      },
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
