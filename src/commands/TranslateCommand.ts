import { Command } from '../Command';
import { BaseCommandInteraction, Client } from 'discord.js';
import { EffectTable } from '../EffectTable';

export const TranslateCommand: Command = {
    name: "translate",
    description: 'Translate an effect ID to an effect',
    run: async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
        const id = interaction.options.get("id", true).value as number
        await interaction.reply({
            content: EffectTable.Instance.translate(id) || "ID not found",
            ephemeral: true
        })
    },
    options: [
        {
            type: 'INTEGER',
            name: "id",
            description: "ID of the effect",
            required: true,
            min_value: 1,
            max_value: 20000
        }
    ]

}
