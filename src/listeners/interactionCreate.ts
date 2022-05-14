import {BaseCommandInteraction, Client, Interaction} from "discord.js";
import {Commands} from "../commands";

export default (client: Client): void =>{
    client.on('interactionCreate', async (interaction: Interaction) => {
        if(interaction.isCommand() || interaction.isContextMenu()) {
            await handleSlashCommand(client, interaction);
        }
    });
}

const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
    const command = Commands.find(c => c.name === interaction.commandName);
    if(!command) {
        await interaction.followUp({
            ephemeral: true,
            content: `Command ${interaction.commandName} not found`
        });
        return;
    }
    command.run(client, interaction);
}