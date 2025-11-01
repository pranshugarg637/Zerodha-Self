const mongoose=require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    fundsAv:{
        type:Number,
        required:true,
        default:0,
    },
    fundsUsed:{
        type:Number,
        required:true,
        default:0,
    },
    // username:{
    //     type:String,
    //     required:true,
    // },
    // password:{
    //     type:String,
    //     required:true,
    // }
    //username and password already by passport
})

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);
