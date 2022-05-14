import {BaseCommandInteraction, ButtonInteraction, Client, Interaction, ModalSubmitInteraction} from "discord.js";
import {Commands} from "../commands";
import {Modals} from "../modals";
import {Buttons} from "../buttons";

export default (client: Client): void =>{
    client.on('interactionCreate', async (interaction: Interaction) => {
        if(interaction.isCommand() || interaction.isContextMenu()) {
            await handleSlashCommand(client, interaction);
        }
        if(interaction.isModalSubmit()) {
            await handleModalSubmit(client, interaction)
        }
        if(interaction.isButton()) {
            await handleButton(client, interaction);
        }
    });
}

const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
    const command = Commands.find(c => c.name === interaction.commandName);
    if(!command) {
        await interaction.reply({
            ephemeral: true,
            content: `Command ${interaction.commandName} not found`
        });
        return;
    }

    await interaction.deferReply();

    command.run(client, interaction);
}

const handleModalSubmit = async (client: Client, interaction: ModalSubmitInteraction) => {
    const modal = Modals.find(m => m.customId === interaction.customId)
    if(!modal) {
        await interaction.reply({
            ephemeral: true,
            content: `Modal ${interaction.customId} not found`
        });
        return;
    }
    modal.run(client, interaction);
}

const handleButton = async (client: Client, interaction: ButtonInteraction) => {
    const button = Buttons.find(m => interaction.customId.startsWith(m.idPrefix));
    if(!button) {
        await interaction.reply({
            ephemeral: true,
            content: `Button ${interaction.customId} not found`
        });
        return;
    }
    button.onClick(client, interaction);
}