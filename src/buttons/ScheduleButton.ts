import {ButtonHandler} from "../ButtonHandler";
import ScheduleController from "../ScheduleController";

export const ScheduleButton: ButtonHandler = {
    idPrefix: "schedule-button-",
    onClick: async (client, interaction) => {
        const schedule = await ScheduleController.getSchedule(interaction.message.id)
        await interaction.update(`Event name is : ${schedule.eventName}`);
    }
}