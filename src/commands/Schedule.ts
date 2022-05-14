import {Command} from "../Command";
import {BaseCommandInteraction, Client} from "discord.js";

export const Schedule: Command = {
    name: "schedule",
    description: "Generates a schedule poll",
    type: "CHAT_INPUT",
    options: [

    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const content = "Hello fuckers!";
        await interaction.reply({
            ephemeral: true,
            content
        })
    }
}