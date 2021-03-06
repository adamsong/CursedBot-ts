import {ButtonHandler} from "../ButtonHandler";
import ScheduleController from "../ScheduleController";
import {
    ButtonInteraction,
    Client, Collection,
    GuildMember,
    MessageActionRow,
    MessageButton,
    MessageEmbed, Snowflake,
    TextChannel
} from "discord.js";
import {SchedulePoll} from "../entity/SchedulePoll";
import {MessageButtonStyles} from "discord.js/typings/enums";
import {PollResponse} from "../entity/PollResponse";
import {PollOption} from "../entity/PollOption";

export const ScheduleButton: ButtonHandler = {
    idPrefix: "schedule",
    onClick: async (client, interaction) => {
        if(interaction.customId.startsWith(`${ScheduleButton.idPrefix}-control`)) {
            const schedule = await ScheduleController.getSchedule(interaction.message.id)
            const control = interaction.customId.split("-")[2];
            if(!schedule && control !== "announce") {
                await interaction.reply({
                    ephemeral: true,
                    content: `No schedule found for message.`
                })
                return
            }
            // Control button
            switch (control) {
                case "respond":
                    if(schedule === null) return;
                    await sendRespond(client, interaction, schedule);
                    break;
                case "count":
                    if(schedule === null) return;
                    await sendCount(client, interaction, schedule);
                    break;
                case "announce":
                    await sendAnnounce(client, interaction);
                    break;
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
                        o.responses = o.responses.filter(r => r.userId !== interaction.user.id)
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
        content: "Please indicate your availability.",
        components: renderButtons(schedule, interaction.user.id)
    })
}

async function sendCount(client: Client, interaction: ButtonInteraction, schedule: SchedulePoll) {
    const voteCount = await countVotes(schedule.options, client, interaction);
    if(!voteCount) return;
    const embed = new MessageEmbed()
        .setTitle("Current Poll Results")
        .setColor(0x000000)
    if(voteCount.nonVoters.size > 0) {
        embed.setDescription(`${voteCount.winners.join(", ")} leading with ${voteCount.winCount} votes, waiting on ${voteCount.nonVoters.size} non-voters. \n\n(${voteCount.nonVoters.map(v => v.displayName).join(", ")})`)
    } else {
        embed.setDescription(`${voteCount.winners.join(", ")} win${voteCount.winners.length == 1 ? "s" : ""} with ${voteCount.winCount} votes.`)
    }
    for(const option of voteCount.sortedOptions) {
        embed.addField(option.displayName, `${option.responses.length} - ${option.responses.map(r => {
            const user = voteCount.channelVoters.find(u => u.id === r.userId);
            return user ? user.displayName : r.userId;
        }).join(", ")}`, false)
    }
    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(`schedule-control-announce-${interaction.message.id}`)
            .setLabel(voteCount.nonVoters.size > 0 ? "Ping Non-Voters" : "Announce Results")
            .setStyle(MessageButtonStyles.PRIMARY)
    )
    await interaction.reply({
        embeds: [embed],
        ephemeral: true,
        components: [row]
    })
}

async function sendAnnounce(client: Client, interaction: ButtonInteraction) {
    const messageId = interaction.customId.split("-")[3]
    const schedule = await ScheduleController.getSchedule(messageId);
    if(!schedule) {
        await interaction.reply({
            ephemeral: true,
            content: `No schedule found for this message. (${messageId})`
        })
        return
    }

    const voteCount = await countVotes(schedule.options, client, interaction);
    if(!voteCount) return;

    if(voteCount.nonVoters.size > 0) {
        await interaction.reply({
            content: `${voteCount.nonVoters.map(v => `<@${v.id}>`).join(", ")}: Please vote for the poll!`
        })
    } else {
        await interaction.reply({
            content: `${interaction.guild?.roles.cache.find(v => v.name === "voter")}: ${voteCount.winners.join(", ")} win${voteCount.winners.length == 1 ? "s" : ""} with ${voteCount.winCount} votes.`,
            allowedMentions: {
                parse: ["roles"]
            }
        })
    }
}

const countVotes = async (options: PollOption[], client: Client, interaction: ButtonInteraction): Promise<VoteCount | undefined> => {
    let sortedOptions = [...options];
    sortedOptions.sort((a, b) => b.responses.length - a.responses.length);
    const channel = await client.channels.fetch(interaction.channelId)
    if(!channel) {
        await interaction.reply({
            ephemeral: true,
            content: "No channel found for this interaction."
        })
        return
    }
    if(channel.type !== "GUILD_TEXT") {
        await interaction.reply({
            ephemeral: true,
            content: "This command is only available in guilds."
        })
        return
    }
    const voterSet = new Set<string>();
    sortedOptions.forEach(option => option.responses.forEach(response => voterSet.add(response.userId)))
    const channelVoters = (channel as TextChannel).members.filter(value => value.roles.cache.some(r => r.name === "voter"));
    const nonVoters = channelVoters.filter(value => !voterSet.has(value.id));

    const winCount = sortedOptions[0].responses.length;
    const winners = sortedOptions.filter(o => o.responses.length === winCount).map(o => o.displayName);

    return {
        winCount: winCount,
        winners: winners,
        nonVoters: nonVoters,
        sortedOptions: sortedOptions,
        channelVoters: channelVoters
    }
}

interface VoteCount {
    winCount: number,
    winners: string[],
    nonVoters: Collection<Snowflake, GuildMember>
    sortedOptions: PollOption[],
    channelVoters: Collection<Snowflake, GuildMember>
}