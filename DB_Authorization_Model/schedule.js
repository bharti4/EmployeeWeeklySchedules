var mysql = require("mysql")
var auth= require('./auth.js');
const { getDb } = require("../DB_Authorization_Model/db");

scheduleModel =
{
selectSchedule: function()
{
    return new Promise((resolve,reject)=>{
              var sql = "SELECT users.surname, users.firstname, schedules.*  FROM schedules , users where users.userId = schedules.userId  order by dayofweek,starttime";
              db.query(sql, function (err, result) {
                 if(err) reject(500) 
                 else resolve(result)
       });
    })
 
},
EmployeeSchedules : (userId) =>
{
    return new Promise((resolve,reject)=>{
         db.query("select * from schedules where userId = ? order by dayofweek,starttime",[userId],(err1,result1)=>
        {
            if(err1) reject(500)
            else resolve (result1);
        })
    })
},
checkScheduleConfict : (req,userId)=>{
    return new Promise((resolve,reject)=>{
            starttime = req.body.starttime;
            endtime= req.body.endttime;
            db.query("select * from schedules where userId = ? and dayofweek =?",[userId,req.body.dayofweek],(err,result)=>
            {
                if(err) reject(500)
                else
                {
                    for(x in result)
                    {
                        if(((starttime >= result[x].starttime && starttime <= result[x].endtime) || (endtime >= result[x].starttime && endtime <= result[x].endtime))  
                        || ((result[x].starttime >= starttime && result[x].starttime <=endtime) || (result[x].endtime >= starttime && result[x].endtime<=endtime)))  
                        {
                        conflictMsg = "Add schedule " +req.body.starttime + "-" + req.body.endtime + "conflicts with "+ result[x].starttime+"-"+result[x].endtime ;
                        resolve([true,conflictMsg])
                        return 0;
                      }
                    }
                  resolve([false ,null])
                }
            })
    })
 },
addEmpSchedule: (req,userId) => {
    return new Promise((resolve,reject)=>{
        var post = {userId: userId, dayofweek: req.body.dayofweek, starttime: req.body.starttime , endtime: req.body.endtime, agenda:req.body.agenda}
        var sql = "insert into schedules SET ?"
        db.query(sql,post,(err,result)=>
        {
            if(err)  reject(500)
            else resolve(result);
            
        })
   })
},
deleteEmpSchdule:(scheduleId)=> {
    return new Promise((resolve,reject)=>{
        var sql = "DELETE FROM schedules WHERE scheduleId = ?;"
        db.query(sql,[scheduleId],(err,result)=>
        {
            if(err)  reject(500)
            else if(result.affectedRows==1) resolve(result);
            else reject(500)
        })
    })
 }
}
module.exports = scheduleModel