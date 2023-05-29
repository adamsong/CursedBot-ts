import {
    AutocompleteInteraction,
    BaseCommandInteraction,
    ButtonInteraction,
    Client, CommandInteraction,
    Interaction,
    ModalSubmitInteraction, SelectMenuInteraction
} from 'discord.js';
import {Commands} from "../commands";
import {Modals} from "../modals";
import {Buttons} from "../buttons";
import {Selects} from "../selects"

export default (client: Client): void =>{
    client.on('interactionCreate', async (interaction: Interaction) => {
        console.log("Handling interaction")
        if(interaction.isCommand()) {
            await handleSlashCommand(client, interaction);
        } else if(interaction.isModalSubmit()) {
            await handleModalSubmit(client, interaction)
        } else if(interaction.isButton()) {
            await handleButton(client, interaction);
        } else if(interaction.isAutocomplete()) {
            await handleAutocomplete(client, interaction)
        } else if(interaction.isSelectMenu()) {
            await handleSelectMenu(client, interaction)
        }
    });
}

const handleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    const command = Commands.find(c => c.name === interaction.commandName);
    if(!command) {
        await interaction.reply({
            ephemeral: true,
            content: `Command ${interaction.commandName} not found`
        });
        return;
    }

    command.run(client, interaction);
}

const handleAutocomplete = async (client: Client, interaction: AutocompleteInteraction): Promise<void> => {
    const command = Commands.find(c => c.name === interaction.commandName && c.autocomplete)
    if(!command || !command.autocomplete) return await interaction.respond([{name: `Autocomplete Error! ${interaction.commandName} doesn't exist or doesn't support autocomplete`, value: ""}])

    command.autocomplete(client, interaction)
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

async function handleSelectMenu(client: Client, interaction: SelectMenuInteraction) {
    const selectMenu = Selects.find(m => interaction.customId.startsWith(m.idPrefix))
    if(!selectMenu) {
        await interaction.reply({
            ephemeral: true,
            content: `No handler for ${interaction.customId} found`
        });
        return;
    }
    selectMenu.onSelect(client, interaction)
}
