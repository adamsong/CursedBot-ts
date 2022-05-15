import {loadConfig} from "../src/config";

describe('Testing config', () => {
    let testConfig: {[name: string]: string} = {}
    beforeEach(() => {
        testConfig = {
            TOKEN: "token",
            DB_HOST: "host",
            DB_USER: "user",
            DB_PORT: "1234",
            DB_PASSWORD: "pass",
            DB_DATABASE: "db",
        }
    });

    test("default test config should not error", () => {
        expect(() => {
            loadConfig(testConfig)
        }).not.toThrow();
    });

    test("full config should return correct values", () => {
        testConfig.PORT = "4321";
        const config = loadConfig(testConfig);
        expect(config.TOKEN).toBe(testConfig.TOKEN);
        expect(config.DB_HOST).toBe(testConfig.DB_HOST);
        expect(config.DB_USER).toBe(testConfig.DB_USER);
        expect(config.DB_PASSWORD).toBe(testConfig.DB_PASSWORD);
        expect(config.DB_DATABASE).toBe(testConfig.DB_DATABASE);
        expect(config.DB_PORT).toBe(Number(testConfig.DB_PORT));
        expect(config.PORT).toBe(4321);
    });

    test("missing token should throw error", () => {
        delete testConfig.TOKEN;
        expect(() => loadConfig(testConfig)).toThrowError();
    });

    test("missing db host should throw error", () => {
        delete testConfig.DB_HOST;
        expect(() => loadConfig(testConfig)).toThrowError();
    });

    test("missing db port should throw error", () => {
        delete testConfig.DB_PORT;
        expect(() => loadConfig(testConfig)).toThrowError();
    });

    test("missing db user should throw error", () => {
        delete testConfig.DB_USER;
        expect(() => loadConfig(testConfig)).toThrowError();
    });

    test("missing db password should throw error", () => {
        delete testConfig.DB_PASSWORD;
        expect(() => loadConfig(testConfig)).toThrowError();
    });

    test("missing db database should throw error", () => {
        delete testConfig.DB_DATABASE;
        expect(() => loadConfig(testConfig)).toThrowError();
    });

    test("non-numeric db port should throw error", () => {
        testConfig.DB_PORT = "abc";
        expect(() => console.log(loadConfig(testConfig))).toThrowError();
    });
});