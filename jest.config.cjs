module.exports = {
  clearMocks: true,
  moduleFileExtensions: ["js", "ts"],
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  resolver: "./jest.resolver.cjs",
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: {
          module: "commonjs",
          moduleResolution: "node",
          esModuleInterop: true,
          isolatedModules: true,
        },
      },
    ],
    "^.+\\.js$": [
      "ts-jest",
      {
        tsconfig: {
          module: "commonjs",
          moduleResolution: "node",
          esModuleInterop: true,
          allowJs: true,
          isolatedModules: true,
        },
      },
    ],
  },
  transformIgnorePatterns: [],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@semantic-release/commit-analyzer$":
      "<rootDir>/tests/__mocks__/@semantic-release/commit-analyzer.cjs",
    "^@semantic-release/release-notes-generator$":
      "<rootDir>/tests/__mocks__/@semantic-release/release-notes-generator.cjs",
  },
  verbose: true,
};