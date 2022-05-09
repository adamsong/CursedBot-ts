import dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_FILE || '.env' });

interface ENV {
    TOKEN: string | undefined;
}

type Config = Required<ENV>;

const getConfig = (): ENV => {
    return {
        TOKEN: process.env.TOKEN
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