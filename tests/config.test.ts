
describe('Testing config', () => {
    test("empty config should throw error", () => {
        process.env.ENV_FILE = 'no_env';
        expect(() => {require('../src/config')}).toThrow();
    });

    test("populated config should not throw error", () => {
        process.env.ENV_FILE = undefined;
        process.env.TOKEN = 'token';
        let config = require('../src/config').default;
        expect(config.TOKEN).toBeDefined();
    });
});