
describe('Testing config', () => {
    beforeEach(() => {
        process.env.ENV_FILE = 'no_env';
        process.env.TOKEN = 'token';
        delete process.env.PORT;
    });

    test("empty config should throw error", () => {
        delete process.env.TOKEN;
        expect(() => {require('../src/config')}).toThrow();
    });

    test("populated config should not throw error", () => {
        let config = require('../src/config').default;
        expect(config.TOKEN).toBeDefined();
        expect(config.PORT).toBeDefined();
    });

    test("token should be settable from env", () => {
        process.env.TOKEN = 'test_token';
        let config = require('../src/config').loadConfig();
        expect(config.TOKEN).toBe('test_token');
    });

    test("port should be settable from env", () => {
        process.env.PORT = '1234';
        let config = require('../src/config').loadConfig();
        expect(config.PORT).toBe(1234);
    });
});