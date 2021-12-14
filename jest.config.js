/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./src/testSupport/JestSetup.ts'],
    moduleNameMapper: {
        '\\.css$': '<rootDir>/src/testSupport/AssetsStubs.js',
        '\\.svg$': '<rootDir>/src/testSupport/AssetsStubs.js',
    },
    globals: {'ts-jest': {useESM: true}},
};
