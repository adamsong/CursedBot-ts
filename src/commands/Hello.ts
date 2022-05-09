import {Command} from "../Command";
import {BaseCommandInteraction, Client} from "discord.js";

export const Hello: Command = {
    name: "hello",
    description: "Returns a greeting",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const content = "Hello";
        await interaction.followUp({
            ephemeral: true,
            content
        })
    }
}