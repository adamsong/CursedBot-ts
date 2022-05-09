import dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_FILE || '.env' });

interface ENV {
    TOKEN: string | undefined;
    PORT: number | undefined;
}

type Config = Required<ENV>;

const getConfig = (): ENV => {
    return {
        TOKEN: process.env.TOKEN,
        PORT: process.env.PORT && Number(process.env.PORT) || 8080
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
