import knex, {Knex} from "knex";
import config from "../config";

const knexConfig: Knex.Config = {
    client: 'mysql2',
    connection: {
        host: config.DB_HOST,
        port: config.DB_PORT,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_DATABASE
    },
};

export const knexInstance = knex(knexConfig);