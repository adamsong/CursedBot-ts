import {Client} from "discord.js";
import ready from "../../src/listeners/ready";
import {Commands} from "../../src/commands";

describe("test ready listener", () => {
    it("should register commands", () => {
        const client = {
            user: {
                username: "test",
            },
            application: {
                commands: {
                    set: jest.fn((commands) => {
                        expect(commands).toBe(Commands);
                    })
                }
            },
            on: jest.fn((event, cb) => {
                expect(event).toBe("ready");
                cb().then(() => {
                    expect(client.application).toBeDefined();
                    if(!client.application) return;
                    expect(client.application.commands.set).toHaveBeenCalled();
                });
            })
        } as unknown as Client;
        ready(client);
        expect(client.on).toHaveBeenCalled()
    });

    it("should return if application is falsy", () => {
        const client = {
            user: {
                username: "test",
            },
            application: false,
            on: jest.fn((event, cb) => {
                expect(event).toBe("ready");
                cb().then();
            })
        } as unknown as Client;
        ready(client);
        expect(client.on).toHaveBeenCalled()
    });

    it("should return if user is falsy", () => {
        const client = {
            user: false,
            application: {
                commands: {
                    set: jest.fn((commands) => {
                        expect(commands).toBe(Commands);
                    })
                }
            },
            on: jest.fn((event, cb) => {
                expect(event).toBe("ready");
                cb().then(() => {
                    expect(client.application).toBeDefined();
                    if(!client.application) return;
                    expect(client.application.commands.set).not.toHaveBeenCalled();
                });
            })
        } as unknown as Client;
        ready(client);
        expect(client.on).toHaveBeenCalled()
    });
});