
import logger from "../config/logger.js";
import client from "../libs/octopusClient.js";
import { errorE005thrower } from "../errorThrower.js";


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
        const stages = [//array of stages of data
            {
                name: 'lgstc_actl_docs',
                query: {
                    select: [
                        'LGSTC_ACTL_DOCS.PRMY_TRNS_CLSS',
                        'LGSTC_ACTL_DOCS.EVNT_DATE',
                        'LGSTC_ACTL_DOCS.DOC_NBR',
                        'LGSTC_ACTL_DOCS.ORDR_NBR',
                        'LGSTC_ACTL_DOCS.DFLT_STRM_CODE',
                        'LGSTC_ACTL_DOCS.DFLT_TO_STRM_CODE',
                        'LGSTC_ACTL_DOCS.TRUCK_FULL_NBR',
                        'LGSTC_ACTL_DOCS.DOC_RMRK',
                        'LGSTC_ACTL_DOCS.TRNS_STAT',
                        'LGSTC_ACTL_DOCS.FIRM_CODE',
                        'LGSTC_ACTL_DOCS.FREE_FLD_1',

                        // for join tables

                        // join tables field
                        'STRMS.STRM_NAME',
                        // 'STRMS_TO.STRM_NAME',
                        'DRIVERS.DRIVER_NAME',
                        'TRNS_CLSS_PARMS.MAIN_SPAWN_SECND_TRNS',
                        'LGSTC_TRNS_TIME.LINE_NBR',
                        'LGSTC_TRNS_TIME.CRE_DATIME'

                    ],

                    from: 'LGSTC_ACTL_DOCS',
                    where: [
                        { field: 'LGSTC_ACTL_DOCS.FIRM_CODE', value: "%{params.firm_code}%", },
                        { field: 'LGSTC_ACTL_DOCS.DOC_NBR', value: "%{params.doc_nbr}%", },
                        { field: 'LGSTC_ACTL_DOCS.PRMY_TRNS_CLSS', value: 331, },
                        { field: 'LGSTC_ACTL_DOCS.TRNS_STAT', value: 50, type: '<' }
                    ],
                    leftJoin: [
                        {
                            table: 'STRMS', on: [{ key1: 'LGSTC_ACTL_DOCS.DFLT_STRM_CODE', key2: 'STRMS.STRM_CODE' },
                            { key1: 'STRMS.FIRM_CODE', key2: 'LGSTC_ACTL_DOCS.FIRM_CODE' }]
                        },
                        // {
                        //     table: 'STRMS', on: [{ key1: 'LGSTC_ACTL_DOCS.DFLT_TO_STRM_CODE', key2: 'STRMS.STRM_CODE' },
                        //     { key1: 'STRMS.FIRM_CODE', key2: 'LGSTC_ACTL_DOCS.FIRM_CODE' }]
                        // },
                        {
                            table: 'DRIVERS', on: [{ key1: 'LGSTC_ACTL_DOCS.DRIVER_CODE', key2: 'DRIVERS.DRIVER_CODE' },]
                        },

                        {
                            table: 'TRNS_CLSS_PARMS', on: [
                                { key1: 'LGSTC_ACTL_DOCS.FIRM_CODE', key2: 'LGSTC_ACTL_DOCS.FIRM_CODE' },
                                { key1: 'LGSTC_ACTL_DOCS.PRMY_TRNS_CLSS', key2: "TRNS_CLSS_PARMS.PRMY_TRNS_CLSS" },
                                { key1: 'LGSTC_ACTL_DOCS.SECND_TRNS_CLSS', key2: "TRNS_CLSS_PARMS.SECND_TRNS_CLSS" }
                            ]
                        },
                        {
                            table: 'LGSTC_TRNS_TIME', on: [
                                { key1: 'LGSTC_ACTL_DOCS.DOC_NBR', key2: "LGSTC_TRNS_TIME.DOC_NBR" },
                                { key1: 'LGSTC_ACTL_DOCS.FIRM_CODE', key2: 'LGSTC_TRNS_TIME.FIRM_CODE' },
                                { key1: 'LGSTC_ACTL_DOCS.PRMY_TRNS_CLSS', key2: "LGSTC_TRNS_TIME.PRMY_TRNS_CLSS" },
                            ]
                        },

                    ],
                    first: true
                },
                breakOnEmpty: true // optional, if to break in case of no-result
            },
            {
                name: 'lgstc_actl_trns',
                query: {
                    select: [

                        'LGSTC_ACTL_TRNS.LINE_TRNS_STAT',
                        'LGSTC_ACTL_TRNS.PART_CODE',
                        'LGSTC_ACTL_TRNS.LINE_NBR',
                        'LGSTC_ACTL_TRNS.QNTY_1',
                        'LGSTC_ACTL_TRNS.FIRM_CODE',
                        'LGSTC_ACTL_TRNS.ORDR_NBR',
                        'LGSTC_ACTL_TRNS.ORDR_LINE_NBR',
                        'LGSTC_ACTL_TRNS.PRMY_TRNS_CLSS',
                        'LGSTC_ACTL_TRNS.DOC_NBR',
                        'LGSTC_ACTL_TRNS.LOT_NBR',
                       
                        // function
                        {
                            raw: `GET_PART_DSCR("LGSTC_ACTL_TRNS"."FIRM_CODE","LGSTC_ACTL_TRNS"."PART_CODE","LGSTC_ACTL_TRNS"."PRMY_TRNS_CLSS",
                "LGSTC_ACTL_TRNS"."DOC_NBR","LGSTC_ACTL_TRNS"."LINE_NBR",'XH','*','*') as PART_DSCR_XH`
            },
                {
                    raw: `GET_PART_DSCR("LGSTC_ACTL_TRNS"."FIRM_CODE","LGSTC_ACTL_TRNS"."PART_CODE","LGSTC_ACTL_TRNS"."PRMY_TRNS_CLSS",
        "LGSTC_ACTL_TRNS"."DOC_NBR","LGSTC_ACTL_TRNS"."LINE_NBR",'R',"LGSTC_ACTL_TRNS"."SPLR_CODE","LGSTC_ACTL_TRNS"."CUST_CODE") as PART_DSCR_R`
    },


                    ],
                    from: 'LGSTC_ACTL_TRNS',
                    where: [
                        { field: 'LGSTC_ACTL_TRNS.FIRM_CODE', value: "%{params.firm_code}%", },
                        { field: 'LGSTC_ACTL_TRNS.DOC_NBR', value: "%{params.doc_nbr}%", },
                        { field: 'LGSTC_ACTL_TRNS.PRMY_TRNS_CLSS', value: 331, },
                        { field: 'LGSTC_ACTL_TRNS.LINE_TRNS_STAT', value: 50, type: '<' },
                    ],
                },
                breakOnEmpty: true // optional, if to break in case of no-result
            },
      
            {
                name: 'stream_to',
                query: {
                    select: ['STRM_CODE', 'STRM_NAME'],
                    from: 'STRMS',
                    where: [
                        { field: 'FIRM_CODE', value: "%{params.firm_code}%", },
                        { field: 'STRM_CODE', value: '%{lgstc_actl_docs.DFLT_TO_STRM_CODE}%' }
                    ],
                    first: true
                },
                breakOnEmpty: true // optional, if to break in case of no-result
            },
        ]
        const stringStages = JSON.stringify(stages);

        const params = { firm_code: 21, doc_nbr: 3138, prmy_trns_clss: 331 };

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
