import client from "../libs/octopusClient.js";
import routes from '../config/routesList.js'

// send to specific controller extendedRoutes
const publishRoutes = () => {

    // examle to publish extendedRoutes

    // client.publish("controllerName", {
    //     controllerName: client.name(),
    //     uniqueTreatments:[
    //         {
    //             'createQuotaForCustomer.endValidation':'ggg'
    //         },
    //         {
    //             'createQuotaForCustomer.ttt':'ttt'
    //         }
    //     ],
    // })
}

export default {publishRoutes}