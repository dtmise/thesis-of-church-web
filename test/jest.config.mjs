export default {
    testEnvironment: 'node',
    transform: {},
    globalSetup: './jest.globalSetup.mjs',
    globalTeardown: './jest.globalTeardown.mjs',
    setupFilesAfterEnv: ['./jest.setup.mjs']
};
