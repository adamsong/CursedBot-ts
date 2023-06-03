import { ButtonHandler } from '../ButtonHandler';
import { MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';
import cardsManager from '../CardsManager';

export const CardButton: ButtonHandler & { getBaseButtons: () => MessageActionRow} = {
    idPrefix: "card",
    onClick: async (client, interaction) => {
        const args = interaction.customId.split("-")
        if(args[1] === "cancel") {
            return await interaction.update({
                components: [CardButton.getBaseButtons()]
            })
        }
        const cards = await cardsManager.getCardsFor(interaction.user.id)
        return await interaction.update({
            components: [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(interaction.customId)
                        .setPlaceholder("Select your card")
                        .addOptions(cards.map(card => {
                            return {
                                label: card.effect.substring(0, 100),
                                description: "",
                                value: card.id
                            }
                        }))
                ),
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId("card-cancel")
                        .setLabel("Cancel")
                        .setStyle(MessageButtonStyles.DANGER)
                )
            ]
        })
    },
    getBaseButtons: () => {
        return new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`card-use`)
                .setStyle(MessageButtonStyles.PRIMARY)
                .setLabel("Use a card"),
            new MessageButton()
                .setCustomId(`card-show`)
                .setStyle(MessageButtonStyles.SECONDARY)
                .setLabel("Show a card"),
            new MessageButton()
                .setCustomId(`card-discard`)
                .setStyle(MessageButtonStyles.DANGER)
                .setLabel("Discard a card")
        )
    }
}
