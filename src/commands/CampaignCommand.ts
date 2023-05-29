import { Command } from '../Command';
import { AutocompleteInteraction, Client, CommandInteraction } from 'discord.js';
import campaignController from '../CampaignController';

export const CampaignCommand: Command = {
    name: "campaign",
    description: 'Select or create a campaign, allowing multiple copies of campaign-specific data',
    run: async (client: Client, interaction: CommandInteraction): Promise<void> => {
        switch(interaction.options.getSubcommand()) {
            case "create":
                const new_name = interaction.options.getString("name", true)
                if(await campaignController.addCampaign(new_name)) {
                    await interaction.reply(`${new_name} created and made the active campaign`)
                } else {
                    await interaction.reply({
                        content: `Campaign ${new_name} already exists`,
                        ephemeral: true
                    })
                }
                break;
            case "delete":
                const delete_name = interaction.options.getString("name", true)
                if(await campaignController.deleteCampaign(delete_name)) {
                    await interaction.reply(`Campaign ${delete_name} deleted successfully`)
                } else {
                    await interaction.reply({
                        content: `Unable to delete ${delete_name}`,
                        ephemeral: true
                    })
                }
                break;
            case "select":
                const select_name = interaction.options.getString("name", true)
                const select_result = await campaignController.selectCampaign(select_name)
                if(select_result) {
                    await interaction.reply({
                        content: select_result,
                        ephemeral: true
                    })
                } else {
                    await interaction.reply(`Active campaign is now ${select_name}`)
                }
                break;
            case "get":
                const get_name = (await campaignController.getActive())?.name
                await interaction.reply({
                    content: get_name || "There is no active campaign",
                    ephemeral: true
                })
                break;
            case "list":
                const list_name = (await campaignController.getActive())?.name
                const names = campaignController.getNames().map(value => value === list_name ? `+ ${value}` : `  ${value}`)
                await interaction.reply({
                    content: "```diff\n" + names.join("\n") + "\n```",
                    ephemeral: true
                })
                break;
            case "oneshot":
                await campaignController.clearCampaign()
                await interaction.reply("Prepped for one-shot")
        }
    },
    autocomplete: async (client: Client, interaction: AutocompleteInteraction) => {
        await interaction.respond(campaignController.getNames(interaction.options.getFocused() as string || "", 25).map(name => {return {name: name, value: name}}))
    },
    options: [
        {
            type: 'SUB_COMMAND',
            name: "create",
            description: "Create a campaign",
            options: [
                {
                    type: 'STRING',
                    name: "name",
                    description: "The name of the new campaign",
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "delete",
            description: "Remove a campaign",
            options: [
                {
                    type: 'STRING',
                    name: "name",
                    description: "The name of the campaign to remove",
                    autocomplete: true,
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "select",
            description: "Change the active campaign",
            options: [
                {
                    type: 'STRING',
                    name: "name",
                    description: "The name of the campaign to select",
                    autocomplete: true,
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "get",
            description: "Gets the currently active campaign",
        },
        {
            type: 'SUB_COMMAND',
            name: "list",
            description: "Lists all campaigns"
        },
        {
            type: 'SUB_COMMAND',
            name: "oneshot",
            description: "Deactivates all campaigns, won't persist campaign data"
        }
    ]

}
