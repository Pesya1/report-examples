import logger from "../config/logger.js";
import client from "../libs/octopusClient.js";
import config from "../config/index.js";


import fs from 'fs/promises';
import path from 'path';
import fs2 from 'fs';


export const writeStream=async(report_name,exportType)=>{
    
    const __dirname = path.resolve();
    let reportPath = path.join(__dirname, `../output/${report_name}_2.${exportType}`);
    const readWrite = async () => {
        try {
            const writeStream = fs2.createWriteStream(reportPath);
            return new Promise(resolve => {
                v.stream().on("data", data => {
                    writeStream.write(data);
                })

                v.stream().on('end', async () => {
                    writeStream.end();
                    resolve('read&write successfully');

                })
            })
        }
        catch (error) {
            console.log('error read stream');
            throw error;
        }
    } 
    await readWrite();

    return 'read&write successfully';
}

export default async function getReport() {
    try {
        logger.debug('try to get report from report ms');
        let options = {timeout: config.octopus.timeout};
        const params = {
            doc_nbr: 1, export: null, firm_code: 21,
            prmy_trns_clss: 342,
            report_name: 'caersarea Purchase Order',
        }
        let reportStream = await client.request("report", params, options);
        logger.debug(`got report stream successfully`);
        await writeStream();
        return { message: 'ok', reportStream }


    }
    catch (err) {
        logger.error(`failed to get report from report ms`)
        throw err;
    }
}

