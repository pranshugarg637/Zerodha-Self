const Order=require("../models/order");

module.exports.addFunds=async(req,res)=>{
    let {newFunds}=req.body;
    if(newFunds<0){
        req.flash("error","Funds with negative value cannot be added");
        res.redirect("/funds");
    }
    else{
        req.user.fundsAv+=Number(newFunds);
        await req.user.save();
        req.flash("success", "Funds added successfully!");
        res.redirect("/funds");
    }
}

module.exports.makeOrder=async(req,res)=>{
    try{
        let {name,qty,price}=req.body;
        const newOrder=new Order({
            purchaser: req.user._id,
            name: name,
            qty:qty,
            price:price,
        });
        let qtyNum = Number(qty);
        let priceNum = Number(price);
        let funds=req.user.fundsAv;
        if(qtyNum*priceNum>funds){
            req.flash("error","You dont have enough funds/margin to order these stocks");
            res.redirect("/addFunds");
        }
        else{
            await newOrder.save();
            req.user.fundsAv-=Number(qtyNum*priceNum);
            req.user.fundsUsed+=Number(qtyNum*priceNum);
            await req.user.save();
            req.flash("success","Stock ordered succesfully and will be added in holding after verification");
            res.redirect("/orders");
        }
    }
    catch(err){
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(e => e.message);
            req.flash("error", messages.join(" "));
            return res.redirect("/makeOrder");
        }
}}

module.exports.withF=async(req,res)=>{
    let {withFunds}=req.body;
    if(withFunds>req.user.fundsAv){
        req.flash("error","You dont have enough funds to withdraw");
        res.redirect("/funds");
    }
    else if(withFunds<0){
        req.flash("error","Pls enter a valid amount to withdraw");
        res.redirect("/funds");
    }
    else{
        req.user.fundsAv-=Number(withFunds);
        await req.user.save();
        req.flash("success", "Funds withdrawn successfully!");
        res.redirect("/funds");
    }
}