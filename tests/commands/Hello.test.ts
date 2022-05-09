import {Commands} from "../../src/commands";
import {Hello} from "../../src/commands/Hello";
import {BaseCommandInteraction, Client, ClientOptions} from "discord.js";
import {RawInteractionData} from "discord.js/typings/rawDataTypes";

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
            followUp: jest.fn()
        } as unknown as BaseCommandInteraction;
        await Hello.run(undefined as unknown as Client, interactionMock);
        expect(interactionMock.followUp).toHaveBeenCalledWith({ephemeral: true, content: "Hello"});
    });
});