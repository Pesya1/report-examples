const stages = [
    // Stage 1 - Customer Transactions with Agents and Entities
    {
        name: 'customer_transactions',
        query: {
            select: [
                // CUSTS fields
                'CUSTS.CUST_LONG_DSCR',     // שם לקוח
                'CUSTS.CUST_CODE',          // קוד לקוח
                'CUSTS.FIRM_CODE',
                'CUSTS.CRE_DATE',           // תחילת עבודה
                'CUSTS.ENT_CODE',           // קוד ישות
                'CUSTS.AGNT_CODE',
                
                // FIRMS fields
                'FIRMS.FIRM_LONG_NAME',     // שם חברה
                'FIRMS.FIRM_CODE as FIRMS_FIRM_CODE', // קוד חברה
                
                // // AGNTS fields (סוכנים)
                // 'AGNTS.CUST_LONG_DSCR as AGNT_CUST_LONG_DSCR', // שם סוכן
                // 'AGNTS.CUST_CODE as AGNT_CUST_CODE',           // קוד סוכן
                
                // ENTITIES fields (יישויות)
                'ENTITIES.ENT_LONG_NAME',                      // שם יישות
                'ENTITIES.ENT_CODE as ENTITIES_ENT_CODE'       // קוד יישות
            ],
            from: 'CUSTS',
            join: [
                {
                    table: 'FIRMS',
                    on: [{ key1: 'CUSTS.FIRM_CODE', key2: 'FIRMS.FIRM_CODE' }]
                }
            ],
            leftJoin: [
                // {
                //     table: 'CUSTS',
                //     alias: 'AGNTS',
                //     on: [
                //         { key1: 'CUSTS.FIRM_CODE', key2: 'AGNTS.FIRM_CODE' },
                //         { key1: 'CUSTS.AGNT_CODE', key2: 'AGNTS.CUST_CODE' }
                //     ]
                // },
                {
                    table: 'ENTITIES',
                    on: [{ key1: 'CUSTS.ENT_CODE', key2: 'ENTITIES.ENT_CODE' }]
                }
            ],
            children:[
                {
                    name:'agent',
                    from:'CUSTS',
                    select:['CUST_CODE','CUST_LONG_DSCR'],
                    parentKey:'AGNT_CODE',
                    childKey:'CUST_CODE',
                    where:[
                        { field: 'FIRM_CODE', value: 21 }
                    ]
                }
            ],
            where: [
                { field: 'CUSTS.FIRM_CODE', value: 21 },
                { field: 'CUSTS.CUST_CODE', value: '1' }
            ],
        },
        first:true,
        breakOnEmpty: true
    },

    // Stage 2 - Parts and models data (depends on parts from stage 1)
    // {
    //     name: 'parts_details',
    //     query: {
    //         select: [
    //             // PARTS fields
    //             'PARTS.PART_CODE',          // קוד פריט
    //             'PARTS.ACTV_Y_N',
    //             'PARTS.PART_LONG_NAME',     // שם פריט
    //             'PARTS.FIRM_CODE',
                
    //             // MODL_NAMES fields
    //             'MODL_NAMES.MODL_CODE',
    //             'MODL_NAMES.MODL_NAME',
                
    //             // VU_CRSTL_PART_H95 fields
    //             'VU_CRSTL_PART_H95.PART_H95_CODE'
    //         ],
    //         from: 'PARTS',
    //         leftJoin: [
    //             {
    //                 table: 'MODL_NAMES',
    //                 on: [
    //                     { key1: 'PARTS.PART_CODE', key2: 'MODL_NAMES.PART_CODE' },
    //                     { key1: 'PARTS.FIRM_CODE', key2: 'MODL_NAMES.FIRM_CODE' }
    //                 ]
    //             },
    //             {
    //                 table: 'VU_CRSTL_PART_H95',
    //                 on: [
    //                     { key1: 'PARTS.FIRM_CODE', key2: 'VU_CRSTL_PART_H95.FIRM_CODE' },
    //                     { key1: 'PARTS.PART_CODE', key2: 'VU_CRSTL_PART_H95.PART_CODE' }
    //                 ]
    //             }
    //         ],
    //         where: [
    //             // This will be populated with values from stage 1
    //             { field: 'PARTS.FIRM_CODE', value: '%{customer_transactions.FIRM_CODE}%' }
    //         ],
    //         orderBy: ['PARTS.PART_CODE', 'MODL_NAMES.MODL_CODE']
    //     }
    // }
];

export default stages;