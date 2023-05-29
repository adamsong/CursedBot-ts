import { Command } from '../Command';
import { Client, CommandInteraction, MessageActionRow, MessageButton } from 'discord.js';
import cardsManager, { CardType } from '../CardsManager';
import { MessageButtonStyles } from 'discord.js/typings/enums';
import { CardButton } from '../buttons/CardButton';

export const CardCommand: Command = {
    name: "card",
    description: 'Draw a card from the deck',
    run: async (client: Client, interaction: CommandInteraction): Promise<void> => {
        const subcommand = interaction.options.getSubcommand();
        switch(subcommand) {
            case "good":
            case "bad":
                let result
                try {
                    result = await cardsManager.drawCard(subcommand === "good" ? CardType.Good : CardType.Bad, interaction.user.id)
                } catch (e: any) {
                    await interaction.reply(e.toString())
                    return
                }
                await interaction.reply(`${interaction.user} drew a ${subcommand} boy card`)
                await interaction.followUp({
                    content: `Your new ${subcommand} boy card reads "${result.effect}"`,
                    ephemeral: true
                })
                break;
            case "hand":
                const hand = await cardsManager.getCardsFor(interaction.user.id)
                const goodCards = hand.filter(card => card.type === CardType.Good).map(card => `- ${card.effect}`).join("\n")
                const badCards = hand.filter(card => card.type === CardType.Bad).map(card => `- ${card.effect}`).join("\n")
                const sections: string[] = []
                if(goodCards) {
                    sections.push(`# Good Cards\n${goodCards}`)
                }
                if(badCards) {
                    sections.push(`# Bad Cards\n${badCards}`)
                }
                let message = sections.join("\n")
                const hasCards = !!message
                if(!message) message = "You have no cards"

                const actionRow = CardButton.getBaseButtons()

                await interaction.reply({
                    content: message,
                    components: hasCards ? [actionRow] : []
                })
        }
    },
    options: [
        {
            type: 'SUB_COMMAND_GROUP',
            name: "draw",
            description: "Draw a card",
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: "good",
                    description: "Draw a good boy card"
                },
                {
                    type: 'SUB_COMMAND',
                    name: "bad",
                    description: "Draw a bad boy card"
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "hand",
            description: "View your hand"
        }
    ]

}
