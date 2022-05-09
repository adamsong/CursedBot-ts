import config from '../src/config';

describe('Testing config', () => {
    test("config values should be defined", () => {
        expect(config.TOKEN).toBeDefined();
    });
});