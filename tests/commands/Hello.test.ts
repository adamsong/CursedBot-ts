import { Commands } from '../../src/commands';
import { Hello } from '../../src/commands/Hello';
import { Client, CommandInteraction } from 'discord.js';

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
        } as unknown as CommandInteraction;
        await Hello.run(undefined as unknown as Client, interactionMock);
        expect(interactionMock.reply).toHaveBeenCalled();
    });
});
