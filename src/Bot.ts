/* istanbul ignore file */
import {Client, Intents} from 'discord.js';
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import config from "./config";
import express from 'express';
import {AppDataSource} from "./data-source";

console.log("Bot is starting...");

const client = new Client({
    intents: new Intents().add(
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_SCHEDULED_EVENTS
    )
});

ready(client);
interactionCreate(client);
let readyCount = 0;
let targetCount = 2;
client.login(config.TOKEN).then(() => {
    readyCount++;
    console.log("Discord client ready")
});

AppDataSource.initialize().then(() => {
    readyCount++;
    console.log("Data source ready")
});

const app = express();
app.get('/api/health', (req, res) => {
    if(readyCount < targetCount) {
        res.status(500).send(`${readyCount}/${targetCount} ready`);
    } else {
        res.send('OK');
    }
});

app.listen(config.PORT, () => {
    console.log(`Listening on port ${config.PORT}`);
});