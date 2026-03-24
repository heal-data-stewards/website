import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"
import prettier from "eslint-plugin-prettier"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "prettier"),
  {
    plugins: { prettier },
    rules: {
      "prettier/prettier": [
        "error",
        {
          printWidth: 80,
          singleQuote: false,
          trailingComma: "es5",
          semi: false,
          tabWidth: 2,
          endOfLine: "auto",
        },
      ],
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
]

export default eslintConfig
