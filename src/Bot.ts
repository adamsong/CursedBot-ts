/* istanbul ignore file */
import { Client } from 'discord.js';
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import config from "./config";
import express from 'express';

console.log("Bot is starting...");

const client = new Client({
    intents: []
});

ready(client);
interactionCreate(client);
let isReady = false;
client.login(config.TOKEN).then(() => isReady = true);

const app = express();
app.get('/api/health', (req, res) => {
    if(!isReady) {
        res.status(500).send("Bot is not ready");
    } else {
        res.send('OK');
    }
});

app.listen(config.PORT, () => {
    console.log(`Listening on port ${config.PORT}`);
});