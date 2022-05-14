import {Command} from "../Command";
import {BaseCommandInteraction, Client, Modal} from "discord.js";
import {ScheduleModal} from "../modals/ScheduleModal";

export const ScheduleCommand: Command = {
    name: "schedule",
    description: "Generates a schedule poll",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        await interaction.showModal(ScheduleModal)
    }
}