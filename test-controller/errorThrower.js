import logger from "./config/logger.js";


/**
 * check, if the error is E005 type- throw error
 * @param {object} error 
 * @param {string} serviceName 
 */ 
export  const errorE005thrower=(error,serviceName)=>{
    if(error.data && error.data.errorCode === 'E005'){
        error.message = `${serviceName} microservice not active`
        logger.error(`${serviceName} microservice not active`,error);
        error.data={status:500};
        error.status=500;
        throw error;
    } 
}


/**
 * throw the input error, if it custom error, from the  system, and readable to the user,
 * or the new general message, if some un-known error occured.
 * @param {object} error 
 * @param {string} message 
 * @param {number} status 
 */
  const errorThrower = (error, message, status) => {
    if ((error && error.status) || (error&&error.data&&error.data.status))
        throw error;
    else
        throw { message, status };
}

export default errorThrower;