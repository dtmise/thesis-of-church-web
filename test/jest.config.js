export default {
    testEnvironment: 'node',
    transform: {},
    globalSetup: './jest.globalSetup.js',
    globalTeardown: './jest.globalTeardown.js',
    setupFilesAfterEnv: ['./jest.setup.js']
};
