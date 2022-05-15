import {ButtonHandler} from "../ButtonHandler";
import ScheduleController from "../ScheduleController";
import {ButtonInteraction, Client, MessageActionRow, MessageButton} from "discord.js";
import {SchedulePoll} from "../entity/SchedulePoll";
import {MessageButtonStyles} from "discord.js/typings/enums";
import {PollResponse} from "../entity/PollResponse";

export const ScheduleButton: ButtonHandler = {
    idPrefix: "schedule",
    onClick: async (client, interaction) => {
        if(interaction.customId.startsWith(`${ScheduleButton.idPrefix}-control`)) {
            const schedule = await ScheduleController.getSchedule(interaction.message.id)
            if(!schedule) {
                await interaction.reply({
                    ephemeral: true,
                    content: `No schedule found for message.`
                })
                return
            }
            // Control button
            const control = interaction.customId.split("-").slice(2).join("-");
            switch (control) {
                case "respond":
                    await sendRespond(client, interaction, schedule);
            }
        } else {
            // Response Button
            const messageId = interaction.customId.split("-")[2];
            const schedule = await ScheduleController.getSchedule(messageId);
            if(!schedule) {
                await interaction.reply({
                    ephemeral: true,
                    content: "No schedule found for this message."
                })
                return
            }
            const option = schedule.options.find(o => o.responseId === interaction.customId);
            if(!option) {
                await interaction.reply({
                    ephemeral: true,
                    content: "No option found for this response."
                })
                return
            }

            const responseIndex = option.responses.findIndex(r => r.userId === interaction.user.id);
            let hasResponded = responseIndex !== -1

            if(!hasResponded) {
                const response = new PollResponse()
                response.userId = interaction.user.id;
                if(option.displayName === "None") {
                    schedule.options.filter(o => o.responseId !== option.responseId).forEach(o => {
                        o.responses = []
                    })
                }
                option.responses.push(response);
            } else {
                option.responses.splice(responseIndex, 1);
            }
            await ScheduleController.save(schedule);

            await interaction.update({
                components: renderButtons(schedule, interaction.user.id)
            })
        }
    }
}

function renderButtons(schedule: SchedulePoll, userId: string) {
    let i = 0;
    let rows = [];
    for (const option of schedule.options) {
        if (i % 5 === 0) {
            rows.push(new MessageActionRow());
        }
        const hasSelected = option.responses.some(r => r.userId === userId);
        const isLast = i === schedule.options.length - 1;
        rows[rows.length - 1].addComponents(new MessageButton()
            .setCustomId(option.responseId)
            .setLabel(option.displayName)
            .setStyle(hasSelected ? (isLast ? MessageButtonStyles.DANGER : MessageButtonStyles.SUCCESS) : MessageButtonStyles.SECONDARY)
        );
        i++;
    }
    return rows;
}

const sendRespond = async (client: Client, interaction: ButtonInteraction, schedule: SchedulePoll) => {
    if(!schedule) {
        await interaction.reply({
            ephemeral: true,
            content: "No schedule found for this message."
        })
        return
    }

    await interaction.reply({
        ephemeral: true,
        content: "Respond to the following options:",
        components: renderButtons(schedule, interaction.user.id)
    })
}