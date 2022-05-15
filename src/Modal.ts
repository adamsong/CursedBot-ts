/* istanbul ignore file */
import {Client, ModalOptions, ModalSubmitInteraction} from "discord.js";

export interface RunnableModal extends ModalOptions {
    run: (client: Client, interaction: ModalSubmitInteraction) => void;
}