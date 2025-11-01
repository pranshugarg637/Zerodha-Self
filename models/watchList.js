const mongoose=require("mongoose");

const watchList=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    cost:{
        type:Number,
        required:true,
    },
})

module.exports=mongoose.model("WatchList",watchList);