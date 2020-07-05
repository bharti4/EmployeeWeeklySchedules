const dbconfig=require("../DB_Authorization_Model/config.js");
var mysql = require("mysql")
var assert = require('assert');

module.exports = 
{
 initDb : function (){
    return new Promise((resolve,reject)=>{
        const db = mysql.createConnection(dbconfig.databseTableconnection);
        db.connect(async function (err) {
            if (err) { 
                reject("App could not connect to the DB.")
                console.log("App could not connect to the DB. Stopping");
            }
            else
            {
                resolve(db);
            }
        })
    })
},
getDb: function () {
    assert.ok(db, "Db has not been initialized. Please called init first.");
    return db;
}
};

