
import logger from "../config/logger.js";
import client from "../libs/octopusClient.js";
import { errorE005thrower } from "../validation/errorThrower.js";


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

const createStagesResult = async () => {

    try {


        // query db
        const stages = [//array of stages of data
        {
            name: 'lgstc_frcst_doc',
            query: {
                select: ['LGSTC_FRCST_DOCS.DOC_NBR', 'LGSTC_FRCST_DOCS.RDCT_PCNT', 'LGSTC_FRCST_DOCS.AMNT_BFOR_RDCT', 'LGSTC_FRCST_DOCS.AMNT_AFTR_RDCT',
                    'LGSTC_FRCST_DOCS.EVNT_DATE', 'LGSTC_FRCST_DOCS.PRMY_TRNS_CLSS', 'LGSTC_FRCST_DOCS.TRNS_STAT', 'LGSTC_FRCST_DOCS.PRFM_BY_NAME',
                    'LGSTC_FRCST_DOCS.FREE_FLD_1', 'LGSTC_FRCST_DOCS.FIRM_CODE', 'LGSTC_FRCST_DOCS.DOC_STAT', 'LGSTC_FRCST_DOCS.DOC_RMRK',
                    // for join tables
                    'LGSTC_FRCST_DOCS.SPLR_CODE',
                    'LGSTC_FRCST_DOCS.STRM_CODE',
                    'LGSTC_FRCST_DOCS.CUR_CODE',
                    'CREDIT_CODES_TTLS.CREDIT_CODE',
                    // join tables field
                    'STRMS.STRM_NAME',
                    'CREDIT_CODES_TTLS.CREDIT_DSCR',
                    'MAALE_USERS.FORMAL_USER_NAME',
                    'REP_EMP_NAMES.REP_EMP_NAME',
                    'VU_CSR_0002_WF_LAST.ACTL_END_TIME',
                    'CURS_NAMES.CUR_SHRT_NAME',
                    'REP_EMP_NAMES_EXTND.PHON_AT_HOME',
                    {raw:`decode("VU_CSR_0002_WF_LAST"."ACTL_END_TIME",null,'טיוטה','') as FUN_ACTL_END_TIME`},
                    {raw:`GET_VAT_COG( 1,  1, "LGSTC_FRCST_DOCS"."EVNT_DATE",  '0' ) as FUN_GET_VAT_COG`},
                ],
                from: 'LGSTC_FRCST_DOCS',
                where: [
                    { field: 'LGSTC_FRCST_DOCS.FIRM_CODE', value: "%{params.firm_code}%", },
                    { field: 'LGSTC_FRCST_DOCS.DOC_NBR', value: "%{params.doc_nbr}%", },
                    { field: 'LGSTC_FRCST_DOCS.PRMY_TRNS_CLSS', value: "%{params.prmy_trns_clss}%", },
                    { field: 'LGSTC_FRCST_DOCS.TRNS_STAT', value: 50, type: '<' }
                ],
                leftJoin: [
                    {
                        table: 'STRMS', on: [{ key1: 'LGSTC_FRCST_DOCS.SPLR_CODE', key2: 'STRMS.STRM_CODE' },
                        { key1: 'STRMS.FIRM_CODE', key2: "%{params.firm_code}%" }]
                    },
    
                    {
                        table: 'VU_CSR_0002_WF_LAST', on: [{ key1: 'VU_CSR_0002_WF_LAST.DOC_NBR', key2: "%{params.doc_nbr}%" },
                        { key1: 'VU_CSR_0002_WF_LAST.FIRM_CODE', key2: "%{params.firm_code}%" },
                        { key1: 'VU_CSR_0002_WF_LAST.PRMY_TRNS_CLSS', key2: "%{params.prmy_trns_clss}%" }
                        ]
                    },
                    {
                        table: 'REP_EMP_NAMES', on: [{ key1: 'VU_CSR_0002_WF_LAST.PLND_EMP_CODE', key2: 'REP_EMP_NAMES.REP_EMP_CODE' },
                        { key1: 'REP_EMP_NAMES.FIRM_CODE', key2: "%{params.firm_code}%" }]
                    },
    
                    { table: 'REP_EMP_NAMES_EXTND', key1: 'REP_EMP_NAMES.REP_EMP_CODE', key2: 'REP_EMP_NAMES_EXTND.REP_EMP_CODE' },
    
                    { table: 'CREDIT_CODES_TTLS', key1: 'LGSTC_FRCST_DOCS.CREDIT_CODE', key2: 'CREDIT_CODES_TTLS.CREDIT_CODE' },
                    { table: 'MAALE_USERS', key1: 'REP_EMP_NAMES.REP_EMP_MAALE_USER', key2: 'MAALE_USERS.USER_NAME' },
                    { table: 'CURS_NAMES', key1: 'LGSTC_FRCST_DOCS.CUR_CODE', key2: 'CURS_NAMES.CUR_CODE' },
                ],
                first: true
            },
            breakOnEmpty: true // optional, if to break in case of no-result
        },
        {
            name: 'lgstc_frcst_trns',
            query: {
                select: ['LGSTC_FRCST_TRNS.LINE_NBR', 'LGSTC_FRCST_TRNS.PART_PRC', 'LGSTC_FRCST_TRNS.QNTY', 'LGSTC_FRCST_TRNS.AMNT_AFTR_RDCT', 'LGSTC_FRCST_TRNS.LINE_TRNS_STAT',
                    'LGSTC_FRCST_TRNS.FIRM_CODE', 'LGSTC_FRCST_TRNS.PART_CODE', 'LGSTC_FRCST_TRNS.PRMY_TRNS_CLSS', 'LGSTC_FRCST_TRNS.DOC_NBR', 'LGSTC_FRCST_TRNS.STRM_CODE', 'LGSTC_FRCST_TRNS.RQSTD_SHIP_DATE',
                    // for join tables
                    'LGSTC_FRCST_TRNS.PART_CODE',
                    'LGSTC_FRCST_TRNS.UNIT_CODE',
                // from join tabels
                'UNIT_NAMES.UNIT_SHRT_NAME',
                'PART_TECH_DTLS.CAT_NBR_DSCR_1',
                'PARTS.PART_LONG_NAME',
                // function
                {raw:`GET_PART_DSCR("LGSTC_FRCST_TRNS"."FIRM_CODE","LGSTC_FRCST_TRNS"."PART_CODE","LGSTC_FRCST_TRNS"."PRMY_TRNS_CLSS",
                "LGSTC_FRCST_TRNS"."DOC_NBR","LGSTC_FRCST_TRNS"."LINE_NBR",'X',"LGSTC_FRCST_TRNS"."SPLR_CODE",'') as FUN_GET_PART_DSCR_X`},
    
                {raw:`GET_PART_DSCR("LGSTC_FRCST_TRNS"."FIRM_CODE","LGSTC_FRCST_TRNS"."PART_CODE","LGSTC_FRCST_TRNS"."PRMY_TRNS_CLSS",
                "LGSTC_FRCST_TRNS"."DOC_NBR","LGSTC_FRCST_TRNS"."LINE_NBR",'PI',"LGSTC_FRCST_TRNS"."SPLR_CODE",'') as FUN_GET_PART_DSCR_PI`},
    
                {raw:`GET_PART_DSCR ("LGSTC_FRCST_TRNS"."FIRM_CODE","LGSTC_FRCST_TRNS"."PART_CODE","LGSTC_FRCST_TRNS"."PRMY_TRNS_CLSS","LGSTC_FRCST_TRNS"."DOC_NBR",
                "LGSTC_FRCST_TRNS"."LINE_NBR", 'R'     ,"LGSTC_FRCST_TRNS"."SPLR_CODE" ,"LGSTC_FRCST_TRNS"."CUST_CODE") as FUN_GET_PART_DSCR_R`},
                
                ],
                from: 'LGSTC_FRCST_TRNS',
                leftJoin: [
                    { table: 'UNIT_NAMES', key1: 'LGSTC_FRCST_TRNS.UNIT_CODE', key2: 'UNIT_NAMES.UNIT_CODE' },
                    {
                        table: 'PARTS', on: [{ key1: 'LGSTC_FRCST_TRNS.PART_CODE', key2: 'PARTS.PART_CODE' },
                        { key1: 'PARTS.FIRM_CODE', key2: "%{params.firm_code}%" }]
                    },
                    {
                        table: 'PART_TECH_DTLS', on: [{ key1: 'PARTS.PART_CODE', key2: 'PART_TECH_DTLS.PART_CODE' },
                        { key1: 'PART_TECH_DTLS.FIRM_CODE', key2: "%{params.firm_code}%" }]
                    },
                ],
                where: [
                    { field: 'LGSTC_FRCST_TRNS.FIRM_CODE', value: "%{params.firm_code}%", },
                    { field: 'LGSTC_FRCST_TRNS.DOC_NBR', value: "%{params.doc_nbr}%", },
                    { field: 'LGSTC_FRCST_TRNS.PRMY_TRNS_CLSS', value: "%{params.prmy_trns_clss}%", },
                    { field: 'LGSTC_FRCST_TRNS.LINE_TRNS_STAT', value: 50, type: '<' },
                ],
                },
                breakOnEmpty: true // optional, if to break in case of no-result
            },
            {
                name: 'firm',
                query: {
                    select: ['CITY', 'FAX_AREA_CODE', 'FAX', 'AREA_PHON_CODE', 'PHON',
                        'POB_CODE', 'ZIP_CODE', 'BSNS_NBR', 'FIRM_LONG_NAME',],
                    from: 'FIRMS',
                    where: [
                        { field: 'FIRM_CODE', value: "%{params.firm_code}%", },
                    ],
                    first: true
                },
                breakOnEmpty: true // optional, if to break in case of no-result
            },
            {
                name: 'splr',
                query: {
                    select: ['SPLR_LONG_DSCR', 'SPLR_CODE', 'CNTCT_PRSN', 'CITY_TO_SHIP',
                        'ZIP_TO_SHIP', 'QTR_TO_SHIP', 'STREET_TO_SHIP', 'VAT_TYPE'],
                    from: 'SPLRS',
                    where: [
                        { field: 'FIRM_CODE', value: "%{params.firm_code}%", },
                        { field: 'SPLR_CODE', value: '%{lgstc_frcst_doc.SPLR_CODE}%' }
                    ],
                    first: true
                },
                breakOnEmpty: true // optional, if to break in case of no-result
            },
        ]
        const stringStages = JSON.stringify(stages);

        const params = { firm_code: 21, doc_nbr: 1, prmy_trns_clss: 342 };

        const string_stagesWithParams = putParams(params, stages, stringStages);

        const json_stagesWithParams = JSON.parse(string_stagesWithParams);

        const data = await queryStages(string_stagesWithParams, json_stagesWithParams);

        return data;
    }
    catch (error) {
        console.log(error);
    }

}
