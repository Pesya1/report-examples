import config  from "./index.js"
export default [
       {
        url:'/v' + config.controller.version + '/firms/:firm_code/test/report/query',
        method: "get",
         permissions: ['all'],
        controller: "createStagesResult",
        first: false,
        timeout: 60000 
    }
]
