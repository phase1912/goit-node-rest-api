module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(\\.test\\.js)"],
  transform: { "^.+\\.js$": "babel-jest" },
  transformIgnorePatterns: ["/node_modules/(?!uuid/)"],
};