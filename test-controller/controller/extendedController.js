import client from "../libs/octopusClient.js";
import extendedActions from "../config/extendedActions.js";
import logger from "../config/logger.js";
import config from "../config/index.js";

// Examines whether handling is needed for sending to a private controller
const stage = async(extendedName,params) => {
    try {
        let options = {};
        options.timeout = config.octopus.timeout

        var keys = Object.keys(extendedActions)
        var values = Object.values(extendedActions)
        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < values[i].length; j++) {
                if(Object.keys(values[i][j])[0] === extendedName){
                    try {
                        var extendedTreatment = await client.request(keys[i],{
                            extendedFunc: Object.values(values[i][j])[0],
                            params: params
                        },options)
                        if(extendedTreatment === undefined)return null;
                        else return extendedTreatment
                    } catch (error) {
                        logger.error(`Sending to ${keys[i]} Controller failed`,error)
                        throw error;
                    }
                } 
            }
        }
    } catch (error) {
        logger.error(error)
        throw error;
    }
}

export default {stage}