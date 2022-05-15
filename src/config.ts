import dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_FILE || '.env' });

interface ENV {
    TOKEN: string | undefined;
    PORT: number | undefined;
    DB_HOST: string | undefined;
    DB_PORT: number | undefined;
    DB_USER: string | undefined;
    DB_PASSWORD: string | undefined;
    DB_DATABASE: string | undefined;
}

interface Config {
    TOKEN: string;
    PORT: number;
    DB_PATH: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
}

const getConfig = (source: {[key: string]: string | undefined} = process.env): ENV => {
    return {
        TOKEN: source.TOKEN,
        PORT: source.PORT && Number(source.PORT) || 8080,
        DB_HOST: source.DB_HOST,
        DB_PORT: source.DB_PORT && Number(source.DB_PORT) || undefined,
        DB_USER: source.DB_USER,
        DB_PASSWORD: source.DB_PASSWORD,
        DB_DATABASE: source.DB_DATABASE,
    }
}

const sanitizeConfig = (config: ENV): Config => {
    for(const [key, value] of Object.entries(config)) {
        if(!value) {
            throw new Error(`Missing config: ${key}`);
        }
    }
    return config as Config;
}

const sanitizedConfig = sanitizeConfig(getConfig());
export default sanitizedConfig;

export function loadConfig(source: {[key: string]: string | undefined} = process.env): Config {
    return sanitizeConfig(getConfig(source));
}
