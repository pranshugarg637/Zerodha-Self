const User=require("../models/user");

module.exports.actualSignup=async (req,res)=>{
    try{
        const {username,password,email}=req.body.user;
        const newUser=new User({email,username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome back to zerodha");
            res.redirect("/home");
        })
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.Logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        } 
        req.flash("success","Logged you out!");
        res.redirect("/home");
    })
}