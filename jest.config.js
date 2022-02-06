/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./src/TestSupport/JestSetup.ts'],
    moduleNameMapper: {
        '\\.css$': '<rootDir>/src/TestSupport/AssetsStubs.js',
        '\\.svg$': '<rootDir>/src/TestSupport/AssetsStubs.js',
    },
    globals: {'ts-jest': {useESM: true}},
};
