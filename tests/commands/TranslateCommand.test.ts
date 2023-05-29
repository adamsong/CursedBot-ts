import { Commands } from '../../src/commands';
import { Client, CommandInteraction } from 'discord.js';
import { TranslateCommand } from '../../src/commands/TranslateCommand';

describe("Test translate command", () => {
    test("should be in index.ts", () => {
        expect(Commands.find(s => s === TranslateCommand)).toBeTruthy();
    });


    it.each([
        [0, "ID not found"],
        [1, "1/2 of caster's body turns to stone"],
        [20000, "The Stars Are Right!"],
        [20001, "ID not found"]
    ])("when the id is %d", async (id, expected) => {
        const interactionMock = {
            reply: jest.fn(object => {
                expect(object.ephemeral).toBeTruthy();
                expect(object.content).toBe(expected);
            }),
            options: {
                get: jest.fn((name, required) => {
                    expect(required).toBeTruthy();
                    if(!TranslateCommand.options) throw "Translate command has no options";
                    expect(name).toBe(TranslateCommand.options[0].name);
                    return {value: id}
                })
            }
        } as unknown as CommandInteraction;
        await TranslateCommand.run(undefined as unknown as Client, interactionMock);
        expect(interactionMock.reply).toHaveBeenCalled();
    });
});
