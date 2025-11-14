if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
const db_url=process.env.ATLASDB_URL;
const express=require("express");
const app=express();
const port=process.env.PORT || 3000;
app.set("view engine","ejs");
const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const ejsMate=require("ejs-mate");
app.engine('ejs',ejsMate);
const mongoose = require('mongoose');
const cookieParser=require("cookie-parser");
app.use(cookieParser());
async function main(){
   await mongoose.connect(db_url);
}
main()
.then(()=>{
    console.log("connection established");
})
.catch((err)=>{
    console.log("some error occured");
})
const expressError=require("./views/utils/expressError");
const wrapAsync=require("./views/utils/wrapAsync");
const {userSchema}=require("./schema");
const User=require("./models/user");
const flash=require("connect-flash");
app.use(flash());
const session=require("express-session");
const MongoStore = require('connect-mongo');
const store=MongoStore.create({
    mongoUrl:db_url,
    crypto:{
        secret:"mysecret",
        touchAfter:24*3600,
    }
})
store.on("error",()=>{
    console.log("some error ",err);
})
const sessionOptions={
    store,
    secret:"mysecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOptions));
const passport=require("passport");
const localStrategy=require("passport-local");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(
  {
    usernameField: 'user[username]',
    passwordField: 'user[password]'
  },
  User.authenticate()
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const { isLoggedIn } = require("./views/utils/loggedin");
const holdings = require("./models/holdings");
const watchList = require("./models/watchList");
const order = require("./models/order");
const authenticateController=require("./controllers/authentication");
const portfolioController=require("./controllers/portfolio");

const validateUser=(req,res,next)=>{
    let {error}=userSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        console.log(msg);
        throw new expressError(400,msg);
    }else{
        next();
    }
}

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user
    // res.locals.username=req.user.username;
    next();
});
app.get("/home",(req,res)=>{ //home page
    res.render("stocks/home")
});
app.get("/about",(req,res)=>{
    res.render("stocks/about");
})
app.get("/signup",(req,res)=>{
    res.render("stocks/signup");
})
app.post("/signup",validateUser,wrapAsync(authenticateController.actualSignup));

app.get("/portfolio", isLoggedIn, (req, res) => {
    let currUser=req.user;
  res.render("stocks/portfolio.ejs",{currUser});
});
app.get("/logout",authenticateController.Logout);
app.use("/holdings",isLoggedIn,async(req,res)=>{
    const allHolding=await holdings.find()
    res.render("brokerage/holding",{holdings:allHolding});
})
app.get("/",(req,res)=>{
    res.render("stocks/home");
})
app.get("/products",(req,res)=>{
    res.render("stocks/products");
})
app.get("/pricing",(req,res)=>{
    res.render("stocks/pricing");
})
app.get("/login",(req,res)=>{
    res.render("stocks/login");
})
app.post("/login",passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),(req,res)=>{
    req.flash("success","welcome back to zerodha");
    res.redirect("/home");
})
app.get("/addFunds",isLoggedIn,(req,res)=>{
    res.render("brokerage/addFunds.ejs");
})
app.post("/addFunds",isLoggedIn,wrapAsync(portfolioController.addFunds));
app.get("/watchlist",isLoggedIn,(req,res)=>{
    res.render("brokerage/watchlist");
})
app.get("/withF",isLoggedIn,(req,res)=>{
    res.render("brokerage/withdrawFunds");
})
app.get("/orders",isLoggedIn,wrapAsync(async(req,res)=>{
    const allOrders=await order.find();
    res.render("brokerage/orders.ejs",{orders:allOrders});
}))
app.get("/makeOrder",isLoggedIn,async(req,res)=>{
    const allWatchList=await watchList.find();
    res.render("brokerage/makeOrder",{watchListOrder:allWatchList});
})
app.post("/makeOrder",isLoggedIn,wrapAsync(portfolioController.makeOrder));
app.post("/withF",isLoggedIn,wrapAsync(portfolioController.withF));

app.get("/funds",isLoggedIn,(req,res)=>{
    res.render("brokerage/funds");
})
app.all(/.*/,(req,res,next)=>{
    next(new expressError(404,"page not found"));
});

//error handling middleware
app.use((err,req,res,next)=>{// throw kare hue error ko yaha catch karenge and then perform operations mentioned in the block
    let {status=500,message="something went wrong"}=err;
    res.status(status).render("stocks/error",{message});
})

app.listen(port,()=>{
    console.log("listening to port");
})