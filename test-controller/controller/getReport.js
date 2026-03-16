import logger from "../config/logger.js";
import client from "../libs/octopusClient.js";
import config from "../config/index.js";


import fs from 'fs/promises';
import path from 'path';
import fs2 from 'fs';
import { OctopusStream } from "octopusmb-client";


export const writeStream=async(reportStream,report_name,exportType)=>{
    
    const __dirname = path.resolve();
    let reportPath = path.join(__dirname, `../output/${report_name}_2.${exportType}`);
    const readWrite = async () => {
        try {
            const writeStream = fs2.createWriteStream(reportPath);
            return new Promise(resolve => {
                reportStream.stream().on("data", data => {
                    writeStream.write(data);
                })

                reportStream.stream().on('end', async () => {
                    writeStream.end();
                    resolve('read&write successfully');

                })
            })
        }
        catch (error) {
            console.log('error read stream',error.message);
           // throw error;
        }
    } 
    await readWrite();

    return 'read&write successfully';
}

export default async function getReport(payload) {
    try {
        logger.debug('try to get report from report ms');
        let options = {timeout: config.octopus.timeout};
        // const params = {
        //     doc_nbr: 1, export: null, firm_code: 21,
        //     prmy_trns_clss: 342,
        //     report_name: 'caersarea Purchase Order',
        // }
           const params = {
            customer_code:"1", firm_code: 21,
            report_name: 'DorAlon customer condition sales'
            //'DorAlon Change Shipping Conditions',
        }
        const mergeParams={...params,...payload.query,...payload.url}
        let reportStream = await client.request("report", mergeParams, options);

        const octopusStream = new OctopusStream({
            stream: reportStream.stream(),
            extra: {
                filename: `${params.report_name}.pdf`,
                download: false //if to download the file immdetly
            }
        })
        logger.debug(`got report stream successfully`);
        // await writeStream(reportStream, params.report_name, 'pdf');
        return  octopusStream ;


    }
    catch (err) {
        logger.error(`failed to get report from report ms`)
        throw err;
    }
}

