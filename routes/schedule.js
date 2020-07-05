const express = require('express');
const router = express.Router();
const varifyToken=require("../DB_Authorization_Model/auth.js").varifyToken;
var datalize = require("datalize");
const field = datalize.field;

// GET schedule listing. /schedule route 
router.get('/',varifyToken, function(req, res, next) {
  userId= req.user;
  schedule.EmployeeSchedules(userId).then(result1=>{
      res.render('schedule',{title:"Employee Schedule", result1:result1});
   }).catch(error=>{
    msg ='Internal Server / Database Error';
    res.status(501).render('schedule',{title:"Employee Schedule",message:{"msg":msg},messageClass:"alert" });
   })
});


//post schedule/add
router.post('/add', datalize([field('dayofweek','Week Day').required(),
                                      field('starttime','Start Time').required(),
                                      field('endtime','End Time').required(),
                                      field('starttime','Start Time').custom(async (value, result) => {
                                        if (await result.getValue('endtime') <= value) {
                                          throw new Error('Start Time should be less than End Time');
                                        }
                                      })
                                    ]),varifyToken,(req , res) =>
{
  
  //check for input field if not valid return message with previous data
  if(!req.form.isValid)
  {
    res.status('401');
    userId= req.user;
    schedule.EmployeeSchedules(userId).then(result1=>{
      res.render('schedule',{title:"Employee Schedule",message: req.form.errors,messageClass: 'alert',  result1:result1});
    }).catch(error=>{
      msg ='Internal Server / Database Error';
      res.status(501).render('schedule',{title:"Employee Schedule", message:{"msg":msg},messageClass:"alert" });
    })
  
  }
  else
  {     //check and add if new schedule does not conflicts with present schedules 
        userId= req.user;
        schedule.checkScheduleConfict(req,userId).then(conflictMsg=>{
            if(conflictMsg[0]) 
            {
              schedule.EmployeeSchedules(userId).then(result1=>{
                res.status(400);
                res.render('schedule',{title:"Employee Schedule",message: {msg:conflictMsg[1]},messageClass: 'alert', result1:result1});
              }).catch(error=>{
                res.status(501);  
                res.render('schedule',{title:"Employee Schedule", message:{"msg":msg},messageClass:"alert"});
              }) 
            }
            else
            {
              schedule.addEmpSchedule(req,userId).then(result=>{
                res.status(201)
                res.redirect('/schedule');
              }).catch(err=>{ 
                     msg ='Internal Server / Database Error '+err;
                     res.status(501);
                     res.render('schedule',{title:"Manage Schedule", message:{"msg":msg},messageClass:"alert" });
              })
            }                       
        }).catch(error=>{
          msg ='Internal Server / Database Error ';
          res.status(501);
          res.render('schedule',{title:"Manage Schedule", message:{"msg":msg},messageClass:"alert"});
        })
  }
     
});

//delete schedule
router.post('/delete/:id',varifyToken,function(req, res, next) {
  schedule.deleteEmpSchdule(req.params.id).then( result => {
          res.redirect("/schedule");
      }).catch(error=>{
         msg ='Internal Server / Database Error';
         res.status(501).render('Error',{title:"Employee Schedule", message:{"msg":msg},messageClass:"alert" });
         })
});

module.exports = router;
