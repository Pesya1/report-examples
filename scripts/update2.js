const oracledb = require('oracledb');
const fs = require('fs');
const path=
'../dor alon B/input/.ejs'
// '../dor alon/input/chnge_shipkk_cond_dor_new.ejs'
//  // '../yad sara demand/input files/demand.ejs'
const id=13 // 2
// 12 dor alon a
//13 dor alon b
const updateDB = async () => {
    try {
        // Set up the path to your Oracle Instant Client libraries
        let lib= 'C:/Users/pesyas/Downloads/instantclient-basic-windows.x64-21.12.0.0.0dbru/instantclient_21_12'
        oracledb.initOracleClient({ libDir: 'C:/oracle_old/instantclient_21_13'});

        const u9d={
            user: 'onenx',
            password: 'poly123',
            connectString: '172.30.17.11:1521/u9d'
        };
        const g3={
            user: 'dbtrans',
            password: 'snartdb',
            connectString: '172.30.17.11:1521/3G'
        }
        const gYS={
            user: 'dbtrans',
            password: 'snartdb',
            connectString: '10.1.200.11:1521/maale'
        }
        const connection = await oracledb.getConnection(u9d);

        console.log('Connected to Oracle database successfully.');

        const data = fs.readFileSync(path, 'utf-8');

        const sqlQuery = `UPDATE WEB_REPORTS_TEMPLATES
                          SET DATA = :data
                          WHERE ID = ${id}`;

        const result = await connection.execute(sqlQuery, { data }, { autoCommit: true });

        console.log('Update result:', result);

        await connection.close(); // Close the connection

    } catch (error) {
        console.log('Failed to update:', error.message);
    }
};

updateDB();
