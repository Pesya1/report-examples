

// const oracledb = require('node-oracledb');
// oracledb.initOracleClient({libDir:'C:/app/product/12.2.0/client_1'});
const { initOracleClient } = oracledb;
const oracledb = require('oracledb');
const fs=require('fs');
const knex=require('knex');
// initOracleClient({libDir:'C:/Users/pesyas/Downloads/instantclient-basic-windows.x64-21.12.0.0.0dbru/instantclient_21_12'});


const updateDB1=async ()=>{
    let connection;
    try{
        const connectionConfig= {
            user : 'onenx',
            password : 'poly123',
            connectString : "172.30.17.11:1521/u9d"
            // connectString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=172.30.17.11)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=u9d)))"

        };
        // const connection = await oracledb.get(connectionConfig);
         connection = await oracledb.getConnection(connectionConfig);

        if (connection) {
            console.log('Connected to Oracle database successfully.');
          } else {
           throw('Failed to connect to Oracle database.');
          } 
          
          const data = fs.readFileSync('../yadSara/flex.html', 'utf-8');

        const sqlQuery = `UPDATE WEB_REPORTS_TEMPLATES
        SET DATA = '${data}'
        WHERE ID = 9;`;
        const result=await connection.queryStream(sqlQuery
        //     ,(err,result)=>{
        //     console.log('update result:',result);
        // }
        )
            console.log('update result:',result);
            if(connection && connection.close)
            connection.close();

    }
    catch(error){
        console.log(`fail to update:`,error.message);
        if(connection && connection.close)
        connection.close();

    }

}

const oracledb = require('oracledb');
const fs=require('fs');
const knex=require('knex');

const updateDB=async ()=>{
    try{
        
       const client = knex({
            client: 'oracledb',
            connection: {
                "user": 'onenx',
                "password": 'poly123',
                "connectString": "172.30.17.11:1521/u9d"
            },
            pool: {
                min: 0,
                max: 10,
                idleTimeoutMillis: 30000
            },
            acquireConnectionTimeout: 60000,
        
        });
        
        // const connection = await oracledb.get(connectionConfig);

        if (client) {
            console.log('Connected to Oracle database successfully.');
          } else {
           throw('Failed to connect to Oracle database.');
          } 
          const data = fs.readFileSync('../yadSara/yadSara.ejs', 'utf-8');


        const sqlQuery = `UPDATE WEB_REPORTS_TEMPLATES
        SET DATA = '${data}'
        WHERE ID = 9;`;

        const result=await client.update(sqlQuery
        //     ,(err,result)=>{
        //     console.log('update result:',result);
        // }
        )
            console.log('update result:',result);

    }
    catch(error){
        console.log(`fail to update:`,error.message);

    }

}

updateDB();
// updateDB1();