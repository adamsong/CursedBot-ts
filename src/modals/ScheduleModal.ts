import {RunnableModal} from "../Modal";
import {MessageActionRow, MessageButton, TextInputComponentOptions} from "discord.js";
import {MessageButtonStyles, MessageComponentTypes, TextInputStyles} from "discord.js/typings/enums";
import ScheduleController from "../ScheduleController";
import {PollOption} from "../entity/PollOption";

export const ScheduleModal: RunnableModal = {
    customId: "schedule",
    title: "Schedule",
    components: [{
        type: MessageComponentTypes.ACTION_ROW,
        components: [
            {
                customId: "eventName",
                label: "Event Name",
                type: MessageComponentTypes.TEXT_INPUT,
                required: true,
                style: TextInputStyles.SHORT,
                placeholder: "Name of the event"
            }
        ]
    }, {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
            {
                customId: "timeslots",
                label: "Time Slots",
                type: MessageComponentTypes.TEXT_INPUT,
                required: true,
                style: TextInputStyles.PARAGRAPH,
                placeholder: "Date 1, Date 2, etc. Max of 19 dates"
            } as TextInputComponentOptions
        ]
    }],
    run: async (client, interaction) => {
        let data: { [customId: string]: string } = {};
        interaction.components.forEach(c => c.components.forEach(c2 => data[c2.customId] = c2.value));
        if(!data.eventName || !data.timeslots) {
            await interaction.reply({
                ephemeral: true,
                content: "Missing fields"
            });
            return;
        }

        const dates = data.timeslots.split(",").map(s => s.trim());
        if(dates.length > 19) {
            await interaction.reply({
                ephemeral: true,
                content: "Too many dates"
            });
            throw new Error("Too many dates");
        }
        let rows = [];
        rows.push(new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("schedule-control-respond")
                .setStyle(MessageButtonStyles.PRIMARY)
                .setLabel("Respond to Poll"),
            new MessageButton()
                .setCustomId("schedule-control-get-schedule")
                .setLabel("Get Schedule")
                .setStyle(MessageButtonStyles.PRIMARY)
        ));
        const message = await interaction.reply({
            content: "Select a date",
            components: rows,
            fetchReply: true
        });

        let options: PollOption[] = [];
        for(let i = 0; i <= dates.length; i++) {
            const label = dates.length === i ? "None" : dates[i];
            const pollOption = new PollOption();
            pollOption.responseId = `schedule-response-${message.id}-${i}-${label}`;
            pollOption.displayName = label;
            options.push(pollOption);
        }
        ScheduleController.addSchedule(message.id, data.eventName, options)
    }

}