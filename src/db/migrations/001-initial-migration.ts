import {knexInstance} from "../knex";

export const up = () => {
    return knexInstance.schema
        .createTable("schedules", table => {
            table.string("messageId").primary();
            table.string("eventName").notNullable();
        })
        .createTable("options", table => {
            table.string("messageId").notNullable();
            table.string("optionId").notNullable();
            table.string("optionName").notNullable();
            table.primary(["messageId", "optionId"]);
        })
}

export const down = () => {
    return knexInstance.schema
        .dropTable("schedules")
        .dropTable("options")
}