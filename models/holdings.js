const mongoose=require("mongoose");

const holdingSchema=new mongoose.Schema({
    instrument:{
        type:String,
        required:true,
    },
    qty:{
        type:Number,
        required:true,
    },
    avg:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        min:0,
    },
    cost:{
        type:Number,
        required:true,
        min:0,
    },
})

module.exports=mongoose.model("Holding",holdingSchema);