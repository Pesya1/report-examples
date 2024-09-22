import routes from '../config/routesList.js'
import controller from '../controller/index.js'
import logger from "../config/logger.js";

// if arrive from gateway
const getRequestFromGateway = async(message) => {
    
    try {
        var flag = false;
        const {params , originalRoute, route, requestID} = message
        
        if(!originalRoute){
            var error = { message: "No originalRoute send from gateway", data:{status:500}}
            logger.error("error in octopus message",error)
            throw error;
        }
        if(!params){
            var error = { message: "No params send from gateway", data:{status:400}}
            logger.error("error in octopus message",error)
            throw error;
        }
        params.requestID = requestID;

        for (let i = 0; i < routes.length; i++) {
            if(routes[i].url === originalRoute.url && routes[i].method === originalRoute.method){
                try {
                    var result = await controller[routes[i].controller](params)
                    return result;//response(result)
                } catch (error) {
                    logger.error("error in response",error)
                    throw error;
                }
            }
        }
        if(!flag){
            var error = { message: "No function found", data:{status:500}}
            logger.error(error)
            throw error;
        }
    } catch (err) {
        logger.error("error occurred while trying to send the request to the handler function",err);
        throw err;
    }
}


export default {getRequestFromGateway}