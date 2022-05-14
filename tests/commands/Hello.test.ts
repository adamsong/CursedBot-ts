import {Commands} from "../../src/commands";
import {Hello} from "../../src/commands/Hello";
import {BaseCommandInteraction, Client, ClientOptions} from "discord.js";

jest.mock("discord.js", () => {
    return {
        Client: jest.fn().mockImplementation(() => { return {}}),
        BaseCommandInteraction: jest.fn().mockImplementation(() => { return {}}),
    }
});

describe("Test hello command", () => {
    test("should be in index.ts", () => {
        expect(Commands.find(s => s === Hello)).toBeTruthy();
    });

    test("should say hello", async () => {
        const interactionMock = {
            reply: jest.fn(object => {
                expect(object.ephemeral).toBeTruthy();
                expect(object.content).toBeDefined();
            }),
        } as unknown as BaseCommandInteraction;
        await Hello.run(undefined as unknown as Client, interactionMock);
        expect(interactionMock.reply).toHaveBeenCalled();
    });
});