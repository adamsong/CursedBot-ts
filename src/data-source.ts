import "reflect-metadata"
import { DataSource } from "typeorm"
import { SchedulePoll } from "./entity/SchedulePoll"
import config from "./config";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [SchedulePoll],
    migrations: [],
    subscribers: [],
})
