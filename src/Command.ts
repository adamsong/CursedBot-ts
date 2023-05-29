/* istanbul ignore file */
import {
    AutocompleteInteraction,
    ChatInputApplicationCommandData,
    Client,
    CommandInteraction
} from 'discord.js';

export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: CommandInteraction) => void;
    autocomplete?: (client: Client, interaction: AutocompleteInteraction) => void
}
