
import logger from "../config/logger.js";
import { errorE005thrower } from "../errorThrower.js";
import client from "../libs/octopusClient.js";
// import stages from "../stages/dor_alon/a_chnge_shp_cond_dor_new.js";
// import stages from "../stages/dor alon b/dor alob b stages.js";
import stages from '../../dor alon B/files/dor alob b stages.js'

export default async function createStagesResult(payload) {
    try {
        // query db 
        const stringStages = JSON.stringify(stages);
        const params = { firm_code: 23, doc_nbr: 1, prmy_trns_clss: 342,customer_code: '1' };
        const mergeParams={...params,...payload.query,...payload.url}
        const string_stagesWithParams = putParams(mergeParams, stages, stringStages);
        const json_stagesWithParams = JSON.parse(string_stagesWithParams);
        const data = await queryStages(string_stagesWithParams, json_stagesWithParams);
        return data;
    }
    catch (error) {
        console.log(error.message);
    }

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
        console.log(`error query db:`, error.message);
        errorE005thrower(error, 'db');
        //throw error;
    }

}
const isObject = (variable) => typeof variable === 'object' && variable !== null;

export const query1stage = async (stage, stringReport, jsonReport) => {
    let result;
    if (stage.query)
        result = await client.request('db', stage.query);
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
        if(stageRow){
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

export const putParams = (params, jsonReport, stringReport) => {


    Object.entries(params).forEach(([key, value]) => {
        stringReport = stringReport.replaceAll(`"%{params.` + key + `}%"`, `"${value}"`);
        stringReport = stringReport.replaceAll("%{params." + key + "}%", `"${value}"`);
        stringReport = stringReport.replaceAll(`"{params.` + key + `}"`, `"${value}"`);
        stringReport = stringReport.replaceAll("{params." + key + "}", `"${value}"`);

    });

    return stringReport;

}