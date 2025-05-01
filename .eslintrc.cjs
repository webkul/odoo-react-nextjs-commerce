module.exports = {
  extends: ["next", "prettier"],
  rules: {
    "no-unused-vars": [
      "error",
      {
        args: "after-used",
        caughtErrors: "none",
        ignoreRestSiblings: true,
        vars: "all",
      },
    ],
    "prefer-const": "error",
    "react-hooks/exhaustive-deps": "error",
  },
};
