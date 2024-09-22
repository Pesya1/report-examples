import client from "../libs/octopusClient.js";
import extendedActions from "../config/extendedActions.js";
import logger from "../config/logger.js";

// get all info from controllers to Extended treatment
const getRequestFromExtendedController = () => {

    try {
        client.on("message", message => {
            const {actions , controllerName} = message
            try {
                if(!controllerName){
                    var error = { message: "No controllerName send", data:{status:500}}
                    logger.error("error in octopus message",error)
                    throw error;
                }
                if(!actions){
                    var error = { message: "No actions send", data:{status:400}}
                    logger.error("error in octopus message",error)
                    throw error;
                }

                // add all info to extendedActions object
                if (!extendedActions[controllerName]){
                    extendedActions[controllerName] = actions
                }

            } catch (error) {
                logger.error('the object from controller is invalid',error)
            }
        })
    } catch (error) {
        throw error;
    }

}

export default {getRequestFromExtendedController}