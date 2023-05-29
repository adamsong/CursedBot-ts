/* istanbul ignore file */
import { ButtonInteraction, Client, SelectMenuInteraction } from 'discord.js';

export interface SelectHandler {
    idPrefix: string;
    onSelect(client: Client, interaction: SelectMenuInteraction): void;
}
