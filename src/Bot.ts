/* istanbul ignore file */
import { Client } from 'discord.js';
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import config from "./config";
import express from 'express';
import {AppDataSource} from "./data-source";

console.log("Bot is starting...");

const client = new Client({
    intents: []
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