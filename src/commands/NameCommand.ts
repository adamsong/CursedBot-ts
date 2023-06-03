import { Command } from '../Command';
import { Client, CommandInteraction, GuildMember } from 'discord.js';
import campaignController from '../CampaignController';
import { AppDataSource } from '../data-source';
import { Nickname } from '../entity/Nickname';
import { IsNull } from 'typeorm';

const nicknameRepo = AppDataSource.getRepository(Nickname)

function updateNicknames(client: Client) {
    const guilds = client.guilds.cache
    return Promise.all(guilds.map((guild) => {
        return guild.members.cache.map(async (member) => {
            try {
                return await member.setNickname(await getNickname(member.id))
            } catch (e) {
                console.log(`Cannot set nickname for ${member.user.username} to ${await getNickname(member.id)}`)
            }
        })
    }).flat())
}
campaignController.onCampaignChange((client: Client) => updateNicknames(client))

async function getNickname(whom: string): Promise<string | null> {
    const [icNick, oocNick] = await Promise.all([
        nicknameRepo.findOneBy({user: whom, campaign: { active: true }}),
        nicknameRepo.findOneBy({user: whom, campaign: IsNull()})
    ])
    if(icNick !== null && oocNick !== null && icNick.nickname.length + oocNick.nickname.length + " ()".length <= 32) {
        return `${icNick.nickname} (${oocNick.nickname})`
    }
    if(icNick !== null) {
        return `${icNick.nickname}`
    }
    if(oocNick !== null) {
        return `${oocNick.nickname}`
    }
    return null
}
export const NameCommand: Command = {
    name: "name",
    description: 'Set your nickname',
    run: async (client: Client, interaction: CommandInteraction): Promise<void> => {
        const subcommand = interaction.options.getSubcommand()
        const name = interaction.options.getString("name", true)
        if(name.length > 32) {
            return interaction.reply({
                content: "Name too long",
                ephemeral: true
            })
        }
        if(subcommand === "ooc") {
            let oocNick = await nicknameRepo.findOneBy({
                user: interaction.user.id,
                campaign: IsNull()
            })
            if(!oocNick) {
                oocNick = new Nickname()
                oocNick.user = interaction.user.id
                oocNick.campaign = null
            }
            oocNick.nickname = name
            await nicknameRepo.save(oocNick)
        } else {
            let nick = await nicknameRepo.findOneBy({
                user: interaction.user.id,
                campaign: {
                    active: true
                }
            })
            if(!nick) {
                nick = new Nickname()
                nick.user = interaction.user.id
                nick.campaign = await campaignController.getActive(client)
            }
            nick.nickname = name
            await nicknameRepo.save(nick)
        }
        const member = interaction.member
        if(!member || !interaction.inCachedGuild()) {
            return await interaction.reply({
                content: "Error setting nickname",
                ephemeral: true
            })
        }
        const success = await new Promise(async (resolve) => {
            (member as GuildMember).setNickname(await getNickname(interaction.user.id)).then(
                (result) => resolve(true),
                async (error) => {
                    console.log(`Failed to set name for ${member.user.username} to ${await getNickname(interaction.user.id)}`)
                    resolve(false)
                }
            )
        })
        if(success) {
            await interaction.reply(`Set ${interaction.options.getSubcommand() === "ooc" ? "nick" : "character name"} to ${name}`)
        } else {
            await interaction.reply(`Unable to set nickname`)
        }
    },
    options: [
        {
            type: 'SUB_COMMAND',
            name: "ooc",
            description: "Sets OOC name",
            options: [
                {
                    type: 'STRING',
                    name: "name",
                    description: "The name you wish to use",
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "character",
            description: "Sets character name",
            options: [
                {
                    type: 'STRING',
                    name: "name",
                    description: "The name you wish to use",
                    required: true
                }
            ]
        }
    ]

}
