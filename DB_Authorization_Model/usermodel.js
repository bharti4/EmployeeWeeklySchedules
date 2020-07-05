var mysql = require("mysql")
var auth= require('./auth.js');
const { response } = require("express");
usermodel =
{
registerUser: function(req){
    return new Promise((resolve,reject)=>{ 
        const { surname, firstname, email, password, confirmpassword } = req.body;
        db.query("select * from Users where email = ?",[email],(error,rows)=>{
            if(error) reject(500);
            if(rows.length)
                    reject(422)
            else {
                    const hashedPassword = auth.getHashedPassword(password);
                    req.body.password = hashedPassword;
                    this.addUser(req).then(msg=> {
                        resolve(201)
                    }).catch(err=>{reject(500)})
                }
            })
    })
},
        
addUser:(req)=>{
    return new Promise((resolve,reject)=>{
        var post = { firstname: req.body.firstname, surname: req.body.surname , email: req.body.email,userpassword: req.body.password}
        var sql = "insert into users SET ?"
        db. query(sql,post,(err,result)=>{
            if(err)  reject(err); 
            else  resolve(201);
        })
    })
},

varifyuser: (req)=>{
    return new Promise((resolve,reject)=>{
        sql="select userid from Users where email = ? and userpassword = ?"
        hashedPassword=auth.getHashedPassword(req.body.password)
        db.query(sql,[req.body.email, hashedPassword],(err,result)=> { 
            if(err) reject(500);            
            else
            {
                if(result.length>0) resolve(result[0])              
                else reject(401)             //"Invalid Credential"
            }
        })
    })
},

selectEmp: (userId) => {
    return new Promise((resolve,reject)=>{
        sql="select surname,firstname,email from Users where userId = ? "
        db.query(sql,[userId],(err,result)=>
        {
            if(err) reject(err)
            else
            {
                db.query("select * from schedules where userId = ?",[userId],(err1,result1)=>
                {
                    if(err1) reject(500)
                    else
                       resolve([result,result1]);
                })
            }
        })
    })
}

}
module.exports = usermodel