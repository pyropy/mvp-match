module.exports = {
  projects: ["./src/*/jest.config.js"],
  coverageDirectory: "./coverage/",
  collectCoverageFrom: ["./src/**/*.{ts,tsx}"],
  testURL: "http://localhost:5000/",
  moduleNameMapper: {
    ".json$": "identity-obj-proxy",
  },
  moduleDirectories: ["node_modules"],
};
