import client from "../libs/octopusClient.js";
import logger from "../config/logger.js";
import gatewayRoutes from './gatewayRoutes.js'
import extendedControllerRoutes from './extendedControllerRoutes.js'


/**
 * when reques come to getway and pass to here with all params
 * @param {*} message // all the params from getway
 */
const getGeneralRequest = () => {
    
    client.on("request",async (message, response, error) => {

        const {params , originalRoute, route, requestID} = message

        // if arrive from gateway
        if(route && originalRoute){
            try {
                var result = await gatewayRoutes.getRequestFromGateway(message)
                response(result)
            } catch (err) {
                logger.error(err)
                error(err)
            }
        }
        else{        // if not arrive from gateway
            try {
                var result = await extendedControllerRoutes.getRequest(message)
                response(result)
            } catch (err) {
                logger.error(err)
                error(err)
            }
        }
    })
}


export default {getGeneralRequest}