/* istanbul ignore file */
import { Client } from 'discord.js';
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import config from "./config";

console.log("Bot is starting...");

const client = new Client({
    intents: []
});

ready(client);
interactionCreate(client);
client.login(config.TOKEN).then();