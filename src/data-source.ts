import "reflect-metadata"
import { DataSource } from "typeorm"
import { SchedulePoll } from "./entity/SchedulePoll"
import config from "./config";
import {PollOption} from "./entity/PollOption";
import "reflect-metadata";
import {PollResponse} from "./entity/PollResponse";
import { Campaign } from './entity/Campaign';
import { DrawnCard } from './entity/DrawnCard';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    synchronize: true,
    logging: true,
    entities: [SchedulePoll, PollOption, PollResponse, Campaign, DrawnCard],
    migrations: [],
    subscribers: [],
})
