import {BaseCommandInteraction, ButtonInteraction, Client, ModalSubmitInteraction} from "discord.js";
import interactionCreate from "../../src/listeners/interactionCreate";
import {Commands} from "../../src/commands";
import {Command} from "../../src/Command";
import {Modals} from "../../src/modals";
import {RunnableModal} from "../../src/Modal";
import {ButtonHandler} from "../../src/ButtonHandler";
import {Buttons} from "../../src/buttons";

describe("interaction create tests", () => {
    it("should error if no command", () => {
        const interaction = {
            reply: jest.fn(),
            isCommand: jest.fn(() => true),
            commandName: 'not-a-command',
        } as unknown as BaseCommandInteraction;
        const client = {
            on: jest.fn((event, cb) => {
                expect(event).toBe('interactionCreate');
                cb(interaction).then(() => {
                    expect(interaction.reply).toBeCalledWith({
                        ephemeral: true,
                        content: `Command ${interaction.commandName} not found`
                    });
                });
            })
        } as unknown as Client;
        interactionCreate(client);
    });

    it("should run command", () => {
        const interaction = {
            reply: jest.fn(),
            isCommand: jest.fn(() => true),
            commandName: 'real-test-command',
        } as unknown as BaseCommandInteraction;
        const command = {
            name: 'real-test-command',
            description: 'test',
            run: jest.fn()
        } as Command;
        const client = {
            on: jest.fn((event, cb) => {
                expect(event).toBe('interactionCreate');
                cb(interaction).then(() => {
                    expect(command.run).toBeCalled();
                    expect(interaction.reply).not.toBeCalled();
                });
            })
        } as unknown as Client;
        Commands.push(command);
        interactionCreate(client);
    });

    it("should error if no modal", () => {
        const interaction = {
            reply: jest.fn(),
            isCommand: jest.fn(() => false),
            isModalSubmit: jest.fn(() => true),
            customId: 'not-a-modal',
        } as unknown as ModalSubmitInteraction;
        const client = {
            on: jest.fn((event, cb) => {
                expect(event).toBe('interactionCreate');
                cb(interaction).then(() => {
                    expect(interaction.reply).toBeCalledWith({ephemeral: true, content: `Modal ${interaction.customId} not found`});
                });
            })
        } as unknown as Client;
        interactionCreate(client);
    });

    it("should run modal", () => {
        const interaction = {
            reply: jest.fn(),
            isCommand: jest.fn(() => false),
            isModalSubmit: jest.fn(() => true),
            customId: 'real-test-command',
        } as unknown as BaseCommandInteraction;
        const modal = {
            customId: 'real-test-command',
            run: jest.fn(),
            components: [],
            title: "test modal"
        } as RunnableModal;
        const client = {
            on: jest.fn((event, cb) => {
                expect(event).toBe('interactionCreate');
                cb(interaction).then(() => {
                    expect(modal.run).toBeCalled();
                    expect(interaction.reply).not.toBeCalled();
                });
            })
        } as unknown as Client;
        Modals.push(modal);
        interactionCreate(client);
    });

    it("should error if no button", () => {
        const interaction = {
            reply: jest.fn(),
            isCommand: jest.fn(() => false),
            isModalSubmit: jest.fn(() => false),
            isButton: jest.fn(() => true),
            customId: 'not-a-button',
        } as unknown as ButtonInteraction;
        const client = {
            on: jest.fn((event, cb) => {
                expect(event).toBe('interactionCreate');
                cb(interaction).then(() => {
                    expect(interaction.reply).toBeCalledWith({ephemeral: true, content: `Button ${interaction.customId} not found`});
                });
            })
        } as unknown as Client;
        interactionCreate(client);
    });

    it("should run button", () => {
        const interaction = {
            reply: jest.fn(),
            isCommand: jest.fn(() => false),
            isModalSubmit: jest.fn(() => false),
            isButton: jest.fn(() => true),
            customId: 'real-test-button',
        } as unknown as BaseCommandInteraction;
        const button = {
            idPrefix: 'real-test',
            onClick: jest.fn()
        } as ButtonHandler;
        const client = {
            on: jest.fn((event, cb) => {
                expect(event).toBe('interactionCreate');
                cb(interaction).then(() => {
                    expect(button.onClick).toBeCalled();
                    expect(interaction.reply).not.toBeCalled();
                });
            })
        } as unknown as Client;
        Buttons.push(button);
        interactionCreate(client);
    });
});