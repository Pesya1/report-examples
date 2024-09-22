import client from "../libs/octopusClient.js";
import routes from '../config/routesList.js'
import publishLocalRoutes from './publishLocalRoutes.js'
import publishextendedRoutes from './publishextendedRoutes.js'

// send to getway microService all the info like routes,name...
const publishRoutes = () => {
    publishLocalRoutes.publishRoutes()
    publishextendedRoutes.publishRoutes()
}

export default {publishRoutes}