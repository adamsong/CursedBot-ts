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

const getConfig = (): ENV => {
    return {
        TOKEN: process.env.TOKEN,
        PORT: process.env.PORT && Number(process.env.PORT) || 8080,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT && Number(process.env.DB_PORT) || undefined,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_DATABASE: process.env.DB_DATABASE,
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

export function loadConfig(): Config {
    return sanitizeConfig(getConfig());
}
