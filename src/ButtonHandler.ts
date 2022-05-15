/* istanbul ignore file */
import {ButtonInteraction, Client} from "discord.js";

export interface ButtonHandler {
    idPrefix: string;
    onClick(client: Client, interaction: ButtonInteraction): void;
}