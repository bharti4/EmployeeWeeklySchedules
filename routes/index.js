var express = require('express');
var router = express.Router();

schedule = require("../DB_Authorization_Model/schedule.js");
const varifyToken=require("../DB_Authorization_Model/auth.js").varifyToken;


/* Get home page*/

router.get('/', varifyToken , (req , res) =>{   
    schedule.selectSchedule().then(result=> {
      res.status(200).render('DisplaySchedule',{title:"User Schedule", result});
      }).catch(error =>{
       res.status(500).render('DisplaySchedule',{title:"User Schedule",message:{'msg':"Database Error:Not able to Query Database"},messageClass: 'alert' });
     })
});

module.exports = router;
