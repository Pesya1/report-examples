const stages = [
    // Stage 1 - Customer Transactions with Agents and Entities
    {
        name: 'header',
        query: {
            select: [
                // FIRMS fields
                'FIRMS.FIRM_LONG_NAME',     // שם חברה
                'FIRMS.FIRM_CODE',          // קוד חברה

                // CUSTS fields
                'CUSTS.AGNT_CODE',          // קוד סוכן
                'CUSTS.CUST_CODE',          // קוד לקוח
                'CUSTS.CUST_LONG_DSCR',     // שם לקוח
                'CUSTS.CRE_DATE',           // תחילת עבודה
                'CUSTS.ACTV_Y_N',           // פעיל/לא פעיל
                'CUSTS.MAX_CREDIT',         // מקסימום אשראי
                'CUSTS.RLBL',               // רלוונטי

                'CUSTS.ENT_CODE',           // קוד ישות
                // ENTITIES fields
                'ENTITIES.ENT_LONG_NAME',   // שם יישות

                // ACNTS fields
                'ACNTS.ACNT_CODE',          // קוד חשבון

                // ACNTS_DTLS fields
                'ACNTS_DTLS.PMNT_TYPE',     // סוג תשלום

                // DOR_CUSTS fields
                'DOR_CUSTS.CLOSE_RSN',      // סיבת סגירה
                'DOR_CUSTS.CLOSE_DATE',     // תאריך סגירה

                // RAW fields
                { raw: 'ACNTS.BILLS_EDEBIT_IN_FCUR as open_ship_amnt' },
                { raw: 'ACNTS.BILLS_EDEBIT_IN_ACUR * -1 AS cash_debt' },

                // not work here
                // { "raw": "get_cheques_fnc_cog(FIRMS.FIRM_CODE, CUSTS.ACNT_CODE, SYSDATE) as acnt_chq" },
                { "raw": "acnt_pmnt_blnc_func_cog ( CUSTS.FIRM_CODE ,CUSTS.ACNT_CODE,CUSTS.CUR_CODE,sysdate) as debt" },
                // { "raw": "fu_amnt_open_blnc(CUSTS.FIRM_CODE, CUSTS.ACNT_CODE, CUSTS.CUR_CODE) as acnt_pmnt_blnc" }
            ],
            from: 'FIRMS',
            join: [
                {
                    table: 'CUSTS',
                    on: [{ key1: 'FIRMS.FIRM_CODE', key2: 'CUSTS.FIRM_CODE' }]
                }
            ],
            leftJoin: [
                {
                    table: 'ENTITIES',
                    on: [{ key1: 'CUSTS.ENT_CODE', key2: 'ENTITIES.ENT_CODE' }]
                },
                {
                    table: 'ACNTS',
                    on: [
                        { key1: 'CUSTS.ACNT_CODE', key2: 'ACNTS.ACNT_CODE' },
                        { key1: 'CUSTS.FIRM_CODE', key2: 'ACNTS.FIRM_CODE' }
                    ]
                },
                {
                    table: 'ACNTS_DTLS',
                    on: [
                        { key1: 'ACNTS.FIRM_CODE', key2: 'ACNTS_DTLS.FIRM_CODE' },
                        { key1: 'ACNTS.ACNT_CODE', key2: 'ACNTS_DTLS.ACNT_CODE' }
                    ]
                }
                ,

                {
                    table: 'DOR_CUSTS',
                    on: [
                        { key1: 'CUSTS.FIRM_CODE', key2: 'DOR_CUSTS.FIRM_CODE' },
                        { key1: 'CUSTS.CUST_CODE', key2: 'DOR_CUSTS.CUST_CODE' }
                    ]
                }
            ],
            children: [
                {
                    name: 'agent',
                    from: 'CUSTS',
                    select: ['CUST_CODE', 'CUST_LONG_DSCR'],
                    parentKey: 'AGNT_CODE',
                    childKey: 'CUST_CODE',
                    where: [
                        { field: 'FIRM_CODE', value: "%{params.firm_code}%" }
                    ]
                }
            ],
            where: [
                { field: 'FIRMS.FIRM_CODE', value: "%{params.firm_code}%" }, // External parameter for filtering by firm_code
                { field: 'CUSTS.CUST_CODE', value: "%{params.customer_code}%" } // External parameter for filtering by cust_code
            ],
            first: true,
        },
        breakOnEmpty: true
    },

    // Stage 2 - Permanent Accounting Transactions
    {
        name: 'pmnt_acnt_trns',
        query: {
            select: [
                'PRMNT_ACNTNG_TRNS.CONTRA_ACNT',
                'PRMNT_ACNTNG_TRNS.FIRM_CODE',
                'PRMNT_ACNTNG_TRNS.DOC_NBR',
                'PRMNT_ACNTNG_TRNS.BLNC_YEAR',
                'PRMNT_ACNTNG_TRNS.EVNT_DATE',
                'PRMNT_ACNTNG_TRNS.AMNT',
                'ACNTS.ACNT_SHRT_NAME',
                'PRMNT_ACNTNG_TRNS.CONTRA_ACNT',
                'PRMNT_ACNTNG_TRNS.DTLS',
                'PRMNT_ACNTNG_TRNS.DTLS2'
            ],
            from: 'PRMNT_ACNTNG_TRNS',
            // first:true,
            leftJoin: [
                {
                    table: 'ACNTS',
                    on: [
                        { key1: 'PRMNT_ACNTNG_TRNS.FIRM_CODE', key2: 'ACNTS.FIRM_CODE' },
                        { key1: 'PRMNT_ACNTNG_TRNS.CONTRA_ACNT', key2: 'ACNTS.ACNT_CODE' }
                    ]
                }
            ],
            where: [
                { field: 'PRMNT_ACNTNG_TRNS.FIRM_CODE', value: "%{params.firm_code}%" },
                { field: 'ACNTS.ACNT_CODE', value: '700279000'/*"%{header.ACNT_CODE}%"*/ },
                { field: 'PRMNT_ACNTNG_TRNS.PRMY_TRNS_CLSS', value: [217, 222], whereIn: true }
            ],
            orderBy: [
                { column: 'PRMNT_ACNTNG_TRNS.FIRM_CODE' },
                { column: 'PRMNT_ACNTNG_TRNS.BLNC_YEAR' },
                { column: 'PRMNT_ACNTNG_TRNS.DOC_NBR' }
            ],
        },
        breakOnEmpty: false
    },

    // Stage 3 - Guarantees 
    {
        name: 'guaranties',
        query: {
            select: [
                'GUARANTIES.ENT_TYPE',
                'GUARANTIES.REFE',
                'GUARANTIES.GRNTY_TYPE_CODE',
                'GUARANTIES.EVNT_DATE',
                'GUARANTIES.EFCT_TO_DATE',
                'GUARANTIES.AMNT',
                'GUARANTIES.CUR_CODE',
                'CURS_NAMES.CUR_SHRT_NAME',
                'GUARANTIES.GRNT_DSCR',
                'GUARANTIES.THIRD_PARTY_DTLS',
                'GUARANTIES.BNDG_DTLS',
                'SPLRS.SPLR_LONG_DSCR',
                'CUSTS.CUST_LONG_DSCR',
                'ACNTS.ACNT_LONG_NAME',
                'GUARANTIES.GRNT_STAT'
            ],
            from: 'GUARANTIES',
            join: [
                {
                    table: 'CURS_NAMES',
                    on: [{ key1: 'GUARANTIES.CUR_CODE', key2: 'CURS_NAMES.CUR_CODE' }]
                }
            ],
            leftJoin: [
                {
                    table: 'CUSTS',
                    on: [
                        { key1: 'GUARANTIES.FIRM_CODE', key2: 'CUSTS.FIRM_CODE' },
                        { key1: 'GUARANTIES.CUST_CODE', key2: 'CUSTS.CUST_CODE' }
                    ]
                },
                {
                    table: 'SPLRS',
                    on: [
                        { key1: 'GUARANTIES.FIRM_CODE', key2: 'SPLRS.FIRM_CODE' },
                        { key1: 'GUARANTIES.CUST_CODE', key2: 'SPLRS.SPLR_CODE' }
                    ]
                },
                {
                    table: 'ACNTS',
                    on: [
                        { key1: 'GUARANTIES.FIRM_CODE', key2: 'ACNTS.FIRM_CODE' },
                        { key1: 'GUARANTIES.ACNT_CODE', key2: 'ACNTS.ACNT_CODE' }
                    ]
                }
            ],
            where: [
                { field: 'GUARANTIES.FIRM_CODE', value: "%{params.firm_code}%" },
                { field: 'GUARANTIES.CUST_CODE', value: "1" }
            ]
        },
        breakOnEmpty: false
    },
    {
        name: 'logistic_transaction_details',
        query: {
            select: [
                'LGSTC_ACTL_TRNS.LINE_TRNS_STAT',
                'LGSTC_ACTL_TRNS.LINE_SIGN',
                'LGSTC_ACTL_TRNS.QNTY_1',
                'LGSTC_ACTL_TRNS.PART_CODE',
                'LGSTC_ACTL_TRNS.PRMY_TRNS_CLSS',
                'LGSTC_ACTL_TRNS.DOC_NBR',
                'PARTS.PART_CODE',
                'PARTS.PART_SHRT_NAME',
                'PARTS.PART_LONG_NAME'
            ],
            from: 'LGSTC_ACTL_TRNS',
            leftJoin: [
                {
                    table: 'PARTS',
                    on: [
                        { key1: 'LGSTC_ACTL_TRNS.FIRM_CODE', key2: 'PARTS.FIRM_CODE' },
                        { key1: 'LGSTC_ACTL_TRNS.PART_CODE', key2: 'PARTS.PART_CODE' }
                    ]
                },
                {
                    table: 'LGSTC_ACTL_DOCS',
                    on: [
                        { key1: 'LGSTC_ACTL_TRNS.FIRM_CODE', key2: 'LGSTC_ACTL_DOCS.FIRM_CODE' },
                        { key1: 'LGSTC_ACTL_TRNS.PRMY_TRNS_CLSS', key2: 'LGSTC_ACTL_DOCS.PRMY_TRNS_CLSS' },
                        { key1: 'LGSTC_ACTL_TRNS.DOC_NBR', key2: 'LGSTC_ACTL_DOCS.DOC_NBR' }
                    ]
                }
            ],
            where: [
                { field: 'LGSTC_ACTL_TRNS.FIRM_CODE', value: 21 },
                { field: 'LGSTC_ACTL_TRNS.LINE_TRNS_STAT', type: '>=', value: 20 },
                { field: 'LGSTC_ACTL_TRNS.LINE_TRNS_STAT', type: '<=', value: 40 },
                { field: 'LGSTC_ACTL_DOCS.CUST_CODE', value: '1' },
                { field: 'LGSTC_ACTL_DOCS.PRMY_TRNS_CLSS', value: [323, 325], whereIn: true },
                { field: 'LGSTC_ACTL_DOCS.TRNS_STAT', type: '>=', value: 20 },
                { field: 'LGSTC_ACTL_DOCS.TRNS_STAT', type: '<=', value: 40 },
                { field: 'LGSTC_ACTL_DOCS.EVNT_DATE', type: '>=', value: { raw: "TO_DATE('01-01-2007 00:00:00', 'DD-MM-YYYY HH24:MI:SS')" } },
                { field: 'LGSTC_ACTL_DOCS.FREE_FLD_1', value: ['1', '2'], whereIn: true }
            ]
        },
        breakOnEmpty: false
    },
    {
        name: 'calc',
        query: {
            sql: "select part_code, part_shrt_name, sum(qnty_prev_year_2)/1000 as prev_year_2, sum(qnty_prev_year_1)/1000 as prev_year_1, sum(qnty_mnth_7)/1000 as month_7, sum(qnty_mnth_8)/1000 as month_8, sum(qnty_mnth_9)/1000 as month_9, sum(qnty_mnth_10)/1000 as month_10, sum(qnty_mnth_11)/1000 as month_11, sum(qnty_mnth_12)/1000 as month_12 from (select EVNT_DATE, PART_SHRT_NAME, PART_CODE, QNTY_1, LINE_SIGN, line_qnty, CASE WHEN EVNT_DATE >= TRUNC(ADD_MONTHS(SYSDATE, -24), 'YYYY') AND EVNT_DATE <= ADD_MONTHS(TRUNC(SYSDATE, 'YYYY'), -12) -1 THEN line_qnty ELSE 0 END AS qnty_prev_year_2, CASE WHEN EVNT_DATE >= TRUNC(ADD_MONTHS(SYSDATE, -12), 'YYYY') AND EVNT_DATE <= TRUNC(SYSDATE, 'YYYY') - 1 THEN line_qnty ELSE 0 END AS qnty_prev_year_1, CASE WHEN TRUNC(EVNT_DATE, 'MM') = TRUNC(ADD_MONTHS(SYSDATE, -14), 'MM') THEN line_qnty ELSE 0 END AS qnty_mnth_7, CASE WHEN TRUNC(EVNT_DATE, 'MM') = TRUNC(ADD_MONTHS(SYSDATE, -13), 'MM') THEN line_qnty ELSE 0 END AS qnty_mnth_8, CASE WHEN TRUNC(EVNT_DATE, 'MM') = TRUNC(ADD_MONTHS(SYSDATE, -12), 'MM') THEN line_qnty ELSE 0 END AS qnty_mnth_9, CASE WHEN TRUNC(EVNT_DATE, 'MM') = TRUNC(ADD_MONTHS(SYSDATE, -2), 'MM') THEN line_qnty ELSE 0 END AS qnty_mnth_10, CASE WHEN TRUNC(EVNT_DATE, 'MM') = TRUNC(ADD_MONTHS(SYSDATE, -1), 'MM') THEN line_qnty ELSE 0 END AS qnty_mnth_11, CASE WHEN TRUNC(EVNT_DATE, 'MM') = TRUNC(ADD_MONTHS(SYSDATE, 0), 'MM') THEN line_qnty ELSE 0 END AS qnty_mnth_12 from (select (LGSTC_ACTL_TRNS.QNTY_1 * LGSTC_ACTL_TRNS.LINE_SIGN * -1) as line_qnty, LGSTC_ACTL_TRNS.LINE_TRNS_STAT, LGSTC_ACTL_TRNS.LINE_SIGN, LGSTC_ACTL_TRNS.QNTY_1, LGSTC_ACTL_TRNS.PART_CODE, LGSTC_ACTL_TRNS.PRMY_TRNS_CLSS, LGSTC_ACTL_TRNS.DOC_NBR, PARTS.PART_SHRT_NAME, PARTS.PART_LONG_NAME, LGSTC_ACTL_DOCS.EVNT_DATE from DBTRANS.LGSTC_ACTL_TRNS LGSTC_ACTL_TRNS inner join DBTRANS.PARTS PARTS on LGSTC_ACTL_TRNS.FIRM_CODE = PARTS.FIRM_CODE and LGSTC_ACTL_TRNS.PART_CODE = PARTS.PART_CODE left join DBTRANS.LGSTC_ACTL_DOCS LGSTC_ACTL_DOCS on LGSTC_ACTL_TRNS.FIRM_CODE = LGSTC_ACTL_DOCS.FIRM_CODE and LGSTC_ACTL_TRNS.PRMY_TRNS_CLSS = LGSTC_ACTL_DOCS.PRMY_TRNS_CLSS and LGSTC_ACTL_TRNS.DOC_NBR = LGSTC_ACTL_DOCS.DOC_NBR where LGSTC_ACTL_TRNS.FIRM_CODE = :firm_code and (LGSTC_ACTL_TRNS.LINE_TRNS_STAT >= 20 and LGSTC_ACTL_TRNS.LINE_TRNS_STAT <= 40) and LGSTC_ACTL_DOCS.CUST_CODE = :customer_code and (LGSTC_ACTL_DOCS.PRMY_TRNS_CLSS = 323 or LGSTC_ACTL_DOCS.PRMY_TRNS_CLSS = 325) and (LGSTC_ACTL_DOCS.TRNS_STAT >= 20 and LGSTC_ACTL_DOCS.TRNS_STAT <= 40) and LGSTC_ACTL_DOCS.EVNT_DATE >= TO_DATE('01-01-2007 00:00:00', 'DD-MM-YYYY HH24:MI:SS') and (LGSTC_ACTL_DOCS.FREE_FLD_1 = '1' or LGSTC_ACTL_DOCS.FREE_FLD_1 = '2')) ) t group by part_code,part_shrt_name",
            bindings: { firm_code: "%{params.firm_code}%", customer_code: "%{params.customer_code}%" }
        }
    },
    {
        "name": "monthes",
        "query": {
            "select": [
                { "raw": "TO_CHAR(TRUNC(ADD_MONTHS(SYSDATE, -24), 'YYYY'), 'YYYY') AS from_prev_year_2" },
                { "raw": "TO_CHAR(TRUNC(ADD_MONTHS(SYSDATE, -12), 'YYYY'), 'YYYY') AS from_prev_year_1" },
                { "raw": "TO_CHAR(ADD_MONTHS(SYSDATE, -14), 'MM/YYYY') AS monthLastYear_2" },
                { "raw": "TO_CHAR(ADD_MONTHS(SYSDATE, -13), 'MM/YYYY') AS monthLastYear_1" },
                { "raw": "TO_CHAR(ADD_MONTHS(SYSDATE, -12), 'MM/YYYY') AS monthLatYear" },
                { "raw": "TO_CHAR(ADD_MONTHS(SYSDATE, -2), 'MM/YYYY') AS monthPresent_2" },
                { "raw": "TO_CHAR(ADD_MONTHS(SYSDATE, -1), 'MM/YYYY') AS monthPresent_1" },
                { "raw": "TO_CHAR(SYSDATE, 'MM/YYYY') AS monthPresent" }
            ],
            "first": true,
            "from": "DUAL"
        }
    }
];

export default stages;