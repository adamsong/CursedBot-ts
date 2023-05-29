import { SelectHandler } from '../SelectHandler';
import { Client, SelectMenuInteraction } from 'discord.js';
import cardsManager, { CardType } from '../CardsManager';
import { CardButton } from '../buttons/CardButton';

export const CardSelect: SelectHandler = {
    idPrefix: "card",
    async onSelect(client: Client, interaction: SelectMenuInteraction) {
        await interaction.update({
            components: [CardButton.getBaseButtons()]
        })
        const cardId = interaction.values[0]
        const hand = await cardsManager.getCardsFor(interaction.user.id)
        const card = hand.find(card => card.id === cardId)
        if(!card) {
            await interaction.followUp({
                content: "That card is not in your hand",
                ephemeral: true
            })
            return
        }

        let action = interaction.customId.split("-")[1];
        switch(action) {
            case "use":
                if(!await cardsManager.useCard(cardId, interaction.user.id)) {
                    await interaction.followUp({
                        content: "Error using card",
                        ephemeral: true
                    })
                    return
                }
                // Fall through
            case "show":
                await interaction.followUp(`${interaction.user} is ${action === "show" ? "showing" : "playing"} a ${card.type === CardType.Good ? "good" : "bad"} boy card:\n- ${card.effect}`)
                break;
            case "discard":
                if(!await cardsManager.useCard(cardId, interaction.user.id)) {
                    await interaction.followUp({
                        content: "Error discarding card",
                        ephemeral: true
                    })
                    return
                }
                await interaction.followUp(`${interaction.user} discarded a ${card.type === CardType.Good ? "good" : "bad"} boy card.`)
                break;
        }
    }
}
