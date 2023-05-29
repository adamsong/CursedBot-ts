import { Commands } from '../../src/commands';
import { Client, CommandInteraction } from 'discord.js';
import { ScheduleModal } from '../../src/modals/ScheduleModal';
import { ScheduleCommand } from '../../src/commands/ScheduleCommand';

describe("Test schedule command", () => {
    test("should be in index.ts", () => {
        expect(Commands.find(s => s === ScheduleCommand)).toBeTruthy();
    });

    test("should open modal", async () => {
        const interactionMock = {
            showModal: jest.fn(modal => {
                expect(modal).toBe(ScheduleModal);
            }),
        } as unknown as CommandInteraction;
        await ScheduleCommand.run(undefined as unknown as Client, interactionMock);
        expect(interactionMock.showModal).toHaveBeenCalled();
    });
});
