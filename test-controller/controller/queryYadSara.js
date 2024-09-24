
import logger from "../config/logger.js";
import client from "../libs/octopusClient.js";
import { errorE005thrower } from "../errorThrower.js";
import fs from 'fs/promises';

let stagesJsonUrl='..\\yad sara demand\\input files\\demand.json';

export const readStages=async()=>{
    try{       
           const data =await  fs.readFile(stagesJsonUrl, 'utf-8');
           let parsedData=JSON.parse(data);
           return parsedData?.stages || []
    }
    catch(err){
        logger.error('fail to get stages json');
        return [];
    }
}

export const putParams = (params, jsonReport, stringReport) => {


    Object.entries(params).forEach(([key, value]) => {
        stringReport = stringReport.replaceAll(`"%{params.` + key + `}%"`, value);
        stringReport = stringReport.replaceAll("%{params." + key + "}%", value);
        stringReport = stringReport.replaceAll(`"{params.` + key + `}"`, value);
        stringReport = stringReport.replaceAll("{params." + key + "}", value);

    });

    return stringReport;

}

export const queryStages = async (stringReport, jsonReport) => {
    try {
        let data = {};
        let n = jsonReport.length;
        for (let i = 0; i < n; i++) {
            let stage = jsonReport[i];
            let { result, json, string } = await query1stage(stage, stringReport, jsonReport);
            stringReport = string, jsonReport = json;
            data[stage.name] = result;
        }
        return data;
    }
    catch (error) {
        console.log(`error query db:`, error);
        errorE005thrower(error, 'db');
        throw error;
    }

}
const isObject = (variable) => typeof variable === 'object' && variable !== null;

export const query1stage = async (stage, stringReport, jsonReport) => {
    let result;
    if (stage.query)
        try {
            result = await client.request('db', stage.query);
        }
        catch (err) {
            logger.error(`fail to query stage from db: ${err.message}`);
            result =[];
        }
    else result = stage.value
    if (stage.breakOnEmpty && (!result || result.length == 0))
        throw { message: `Can't execute report stage: ${stage.name}. empty results for stage '${stage.name}'. `, status: 401 };
    //if the stage result is require for the next stages
    if (stringReport.includes(`%{${stage.name}`)) {
        let stageRow;
        if (!Array.isArray(result) && isObject(result))
            stageRow = result;
        else if (result.length > 0)
            stageRow = result[0];
        if (stageRow) {
            Object.entries(stageRow).forEach(([key, value]) => {
                stringReport = stringReport.replace(`%{${stage.name}.${key}}%`, value);
                stringReport = stringReport.replace(`%{${stage.name}[0].${key}}%`, value);
            });
            jsonReport = JSON.parse(stringReport);
            return { string: stringReport, json: jsonReport, result };
        }
    }
    return { string: stringReport, json: jsonReport, result };
}

const createStagesResult = async () => {

    try {

        logger.debug('createStagesResult start!');

        // query db
        const stages = await readStages();
        const stringStages = JSON.stringify(stages);

        const params = { firm_code: 21, doc_nbr: 15084, prmy_trns_clss: 332,primary_trans_class:332 };

        const string_stagesWithParams = putParams(params, stages, stringStages);

        const json_stagesWithParams = JSON.parse(string_stagesWithParams);

        const data = await queryStages(string_stagesWithParams, json_stagesWithParams);

        return data;
    }
    catch (error) {
        console.log(error);
    }

}

export default createStagesResult;
