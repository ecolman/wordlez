import type { Config } from "jest";
import type { JestConfigWithTsJest } from "ts-jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const configTs: JestConfigWithTsJest = {
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "jsdom",
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["./src/setup-jest.ts"],
  moduleNameMapper: {
    "^lodash-es$": "lodash",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(configTs as Config);
