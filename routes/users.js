const express = require('express');
const router = express.Router();
const usermodels = require('../DB_Authorization_Model/usermodel.js')
const {varifyToken,setTocken}=require("../DB_Authorization_Model/auth.js");
var datalize = require("datalize");
const field = datalize.field;


//user/:id get specific emplyoee schedule 
router.get('/employee/:id',varifyToken,function(req, res, next) {
   usermodels.selectEmp(req.params.id).then( resultArr => {
          res.render('DisplayEmployee',{title:"Employee Schedule", result:resultArr[0],result1:resultArr[1]});
      }).catch(error=>{
          msg ='Internal Server / Database Error'+error;
          res.status(501).render('DisplayEmployee',{title:"Employee Schedule", message:{"msg":msg},messageClass:"alert" });
          })
});

// /register for sign up form display for new users
router.get('/register', function(req, res) {
    res.render('register',{title:"User Sign Up"});
});

// validation fiels for registration route defined next to this
const registerFieldValidation = 
datalize([
	field('email', 'E-mail').required().email(),
	field('surname', 'SurName').required(),
	field('firstname', 'First Name').required().trim(),
  field('password', 'Password').required().custom(async (value) => {
    const regexp = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})");
    if (!regexp.test(String(value))) {
        throw new Error('%s must be 6 to 20 characters string with at least one digit, one upper case letter, one lower case letter and one special symbol (“@#$%”)');
      } }),
  field('confirmpassword','Confirm Password').required().custom(async (value, result) => {
    if (await result.getValue('password') !== value) {
      throw new Error('Confirm Password must be same as Password.');
    }
  })
]);

// /register  for sign up new users
router.post('/register',registerFieldValidation,(req, res)=> {
    
    if(!req.form.isValid)
    {
      res.status('400');
      res.render('register', {
        title: "User sign Up",
        message: req.form.errors,
        messageClass: 'alert'
        });
   }
    else
    {
     usermodels.registerUser(req)
     .then(msg=>{
        msg = "Registration Successfull , You can login !!" 
        res.status(201).render('login', {title: "Employee Login",  message:{"msg":msg},messageClass: 'success'});
      }).catch(error=>{
        if(error==422) {
           msg ='User with same E-mail is already register.'
          res.status(422).render('register', {title: "User sign Up",message:{"msg":msg},messageClass: 'alert'});
        }   
        else  {
          msg='Internal Server / Database Error'
          res.status(501).render('register', {title: "User sign Up",message:{"msg":msg},messageClass: 'alert'});
        }
       })
   }
})
// login form display
router.get('/login',(req,res)=>{
   res.render('login',{title:"Employee Login "});
});

//validation for login form
const loginFieldsValidation = datalize([field('email', 'E-mail').required().email(),
                                      field('password', 'Password').required().custom(async (value) => {
                                    const regexp = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})");
                                    if (!regexp.test(String(value))) {
                                        throw new Error('%s must be 6 to 20 characters string with at least one digit, one upper case letter, one lower case letter and one special symbol (“@#$%”)');
                            } })
                            ]);
// login post
router.post('/login',loginFieldsValidation , (req,res)=>
{
 
  if(!req.form.isValid)
  {
   res.status(400)
   res.render('login', {
    title:"Employee Login",
     message: req.form.errors,
     messageClass: 'alert'
     });
  }
  else{
      usermodels.varifyuser(req)
      .then( userid=>{
          setTocken(res,userid)
          res.status(200).redirect("/");
      }).catch(err=>{
          if(err===401){
              msg ='Invalid Credential , Please Try Agian.';
              res.status(401).render('login',{title:"Employee Login", message:{"msg":msg},messageClass:"alert"});
            }
            else {
              msg ='Internal Server / Database Error'+err;
              res.status(500).render('login',{title:"Employee Login", message:{"msg":msg},messageClass:"alert"});
             }
        })
  }
});

router.get('/logout',(req,res)=>{
   res.clearCookie('authtoken');
   res.redirect('/users/login');
});

module.exports = router;
