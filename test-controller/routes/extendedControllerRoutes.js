import controller from '../controller/index.js'
import logger from "../config/logger.js";

// if not arrive from gateway
const getRequest = async(message) => {
    
    try {
        const {extendedFunc , params, requestID} = message
        
        if(!extendedFunc){
            var error = { message: "No extendedFunc send", data:{status:500}}
            logger.error("error in octopus message",error)
            throw error;
        }
        if(!params){
            var error = { message: "No params send", data:{status:400}}
            logger.error("error in octopus message",error)
            throw error;
        }
        params.requestID = requestID;

        try {
            var result = await controller[extendedFunc](params)
            return result;
        } catch (error) {
            logger.error("error when send extendedFunc",error)
            throw error;
        }
    } catch (err) {
        logger.error("error occurred while trying to send to extendedFunc",err);
        throw err;
    }
}


export default {getRequest}