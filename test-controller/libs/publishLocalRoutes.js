import client from "../libs/octopusClient.js";
import routes from '../config/routesList.js'
import config from '../config/index.js'

// send to getway microService all the info like routes,name...
const publishRoutes = () => {
    var routesArray = []
    routes.forEach(r => {
        var route = {
            url: r.url,
            method: r.method,
            permissions:r.permissions,
            first: r.first
        }
        routesArray.push(route) 
    })
    client.publish("gateway",{        
        name: config.octopus.group,
        routes: routesArray,
    })
}

export default {publishRoutes}