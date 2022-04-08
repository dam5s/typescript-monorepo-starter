/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: [
        './src/RemoteDataMatchers.ts'
    ],
    globals: {'ts-jest': {useESM: true, isolatedModules: true}},
};
