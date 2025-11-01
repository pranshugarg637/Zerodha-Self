require('dotenv').config();
const mongoose=require("mongoose");
const WatchList=require("../models/watchList");

async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
}
main().then(()=>{
    console.log("connected succesfully");
})
.catch((err)=>{
    console.log(err);
});

// const User=require("../models/user");
// const user1= new User({
//     email:"pranshunikhil2007@gmail.com",
//     username:"helloji",
//     password:"helloji",
// });
// user1.save();
const watchListData=[
    {
        name:"BHARTIARTL",
        cost:1555.45,
    },
    {
        name:"ONGC",
        cost:116.8,
    },
    {
        name:"TCS",
        cost:3194.8,
    },
    {
        name:"KPITTECH",
        cost:266.45,
    },
    {
        name:"QUICKHEAL",
        cost:308.55
    },
    {
        name:"WIPRO",
        cost:577.75,
    },
    {
        name:"M&M",
        cost:779.8
    },
    {
        name:"RELIANCE",
        cost:2112.4,
    },
    {
        name:"HUL",
        cost:512.4,
    }
]
WatchList.insertMany(watchListData).then(()=>{
    console.log("succesfully added data");
});
