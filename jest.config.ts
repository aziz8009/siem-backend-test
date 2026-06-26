import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",

    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.test.json",
        },
    },

    roots: ["<rootDir>/src"],

    testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],

    moduleFileExtensions: ["ts", "js", "json"],

    transform: {
        "^.+\\.ts$": "ts-jest",
    },

    collectCoverage: true,

    collectCoverageFrom: ["src/**/*.ts", "!src/index.ts", "!src/server.ts", "!src/**/*.d.ts"],

    coverageDirectory: "coverage",

    clearMocks: true,

    modulePathIgnorePatterns: ["<rootDir>/dist"],
};

export default config;
