import logger from "./config/logger.js";
import client from "./libs/octopusClient.js";
import config from './config/index.js'
import bootstrap from './libs/bootstrap.js'
import packageJson from './config/packageJson.js'
import publish from './libs/publish.js'


//options for octopusMB client
let options = {
    host: config.octopus.host,
    port: config.octopus.port,
    ssl: config.octopus.ssl,
    group: config.octopus.group,
    name: config.octopus.name,
    rwsOptions: {
        
    }
}

/**
 * Starting async function
 */
const start = async () => {
    try {
        await packageJson();
        logger.info(config.package.name + " service started");
        logger.info("version: " + config.package.version);
        await bootstrap();
        client.connect(options);
    } catch (err) {
        logger.error("error starting service:", err);
    }
}

//start service
await start();

client.on("open", () => {
    logger.info("octopusMB connection opened");
    // send to getway microService all the info like routes,name...
    publish.publishRoutes()
    setInterval(() => {publish.publishRoutes()},config.controller.publishInterval);
});

client.on('close', () => {
    logger.info("octopusMB connection closed");
});

client.on("error", (error) => {
    logger.error("octopusMB error:",error);
});
