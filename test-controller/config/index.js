import env from 'dotenv-defaults'
import dotenvParseVariables from 'dotenv-parse-variables';

let baseEnv = env.config();
let parsedEnv = dotenvParseVariables(baseEnv.parsed);

export default {
    octopus: {
        host: parsedEnv.OCTOPUS_HOST,
        port: parsedEnv.OCTOPUS_PORT,
        ssl: parsedEnv.OCTOPUS_SSL,
        group: parsedEnv.OCTOPUS_GROUP,
        name: parsedEnv.OCTOPUS_NAME,
        timeout: parsedEnv.OCTOPUS_TIMEOUT, 
    },
	log: {
        file: parsedEnv.LOG_FILE,
        days: parsedEnv.LOG_DAYS,
        maxSize: parsedEnv.LOG_MAX_SIZE,
        zip: parsedEnv.LOG_ZIP,
        maxFiles: parsedEnv.LOG_MAX_FILES,
    },
    controller: {
        version: parsedEnv.VERSION,
        publishInterval: parsedEnv.PUBLISH_INTERVAL
    }
}