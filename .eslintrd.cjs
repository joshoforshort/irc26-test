// .eslintrc.cjs
module.exports = {
    extends: ["next", "next/core-web-vitals"],
    rules: {
      // Allow `any` for now
      "@typescript-eslint/no-explicit-any": "off",
  
      // Do not fail build on unused vars, just warn
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  };
  