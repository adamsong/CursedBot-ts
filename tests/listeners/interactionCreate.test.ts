import {BaseCommandInteraction, Client} from "discord.js";
import interactionCreate from "../../src/listeners/interactionCreate";
import {Commands} from "../../src/commands";
import {Command} from "../../src/Command";

describe("interaction create tests", () => {
    it("should error if no command", () => {
        const interaction = {
            deferReply: jest.fn(),
            followUp: jest.fn(),
            isCommand: jest.fn(() => true),
            commandName: 'test',
        } as unknown as BaseCommandInteraction;
        const client = {
            on: jest.fn((event, cb) => {
                expect(event).toBe('interactionCreate');
                cb(interaction).then(() => {
                    expect(interaction.deferReply).not.toBeCalled();
                    expect(interaction.followUp).toBeCalledWith({ephemeral: true, content: 'Command test not found'});
                });
            })
        } as unknown as Client;
        interactionCreate(client);
    });

    it("should run command", () => {
        const interaction = {
            deferReply: jest.fn(),
            followUp: jest.fn(),
            isCommand: jest.fn(() => false),
            isContextMenu: jest.fn(() => true),
            commandName: 'realTest',
        } as unknown as BaseCommandInteraction;
        const command = {
            name: 'realTest',
            description: 'test',
            run: jest.fn()
        } as Command;
        const client = {
            on: jest.fn((event, cb) => {
                expect(event).toBe('interactionCreate');
                cb(interaction).then(() => {
                    expect(interaction.deferReply).toBeCalled();
                    expect(command.run).toBeCalled();
                });
            })
        } as unknown as Client;
        Commands.push(command)
        interactionCreate(client);
    })
});