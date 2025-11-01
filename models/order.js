const mongoose=require("mongoose");

const orderSchema=new mongoose.Schema({
    purchaser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    qty:{
        type:Number,
        required:true,
        min:0,
    },
    price:{
        type:Number,
        required:true,
        min:0,
    },
})

module.exports=mongoose.model("Order",orderSchema);