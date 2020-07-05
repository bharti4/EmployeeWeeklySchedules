const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const TOKENSECRET = "HappyDayAlways";

module.exports =
{
 getHashedPassword : (password ) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
},

varifyToken: (req,res,next)=>{
    const token=req.cookies.authtoken;
    if(!token) 
    {
        res.status(401);
        res.render('Error',{title:"Error", message:{"msg":"Access Denied , Please Login to Access "},messageClass:"alert"  });
        return 0;
    }

    try{
        const varified = jwt.verify(token,TOKENSECRET)
        req.user = varified._id.userid;
        res.locals.user = varified;
        next();
    }
    catch(err)
    {
        res.status(500);
        res.render('Error',{title:"Error", message:{"msg":"Internal Server Error "+err},messageClass:"alert"   });
    }

},
setTocken :(res,userid)=>
{
    const token = jwt.sign({_id:userid},TOKENSECRET);
    res.cookie('authtoken',token );
}

}