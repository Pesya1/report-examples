import logger from '../config/logger.js';
import routes from '../routes/route.js'
import routeExtendedController from '../routes/routeExtendedController.js'
/**
 * Bootstrap function to run preservice actions 
 * @param {*} options 
 */
const bootstrap = async (options) => {
    try {
        //add bootstrap functions here
        try {
            routes.getGeneralRequest() 
            routeExtendedController.getRequestFromExtendedController()
        } catch (error) {
            logger.error("error occurred while trying to send the routing array to GETWAY", err);
            throw err;
        }

    } catch (err) {
        logger.error("error bootstrapping service", err);
        throw err;
    }
}

export default bootstrap