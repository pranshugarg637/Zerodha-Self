require('dotenv').config();
const Holding=require("../models/holdings");
const mongoose=require("mongoose");


let tempHoldings =[
    {
      instrument: "BHARTIARTL",
      qty: 2,
      avg: 538.05,
      price: 541.15,
      cost:1082.30
    },
    {
      instrument: "HDFCBANK",
      qty: 2,
      avg: 1383.4,
      price: 1522.35,
      cost:3044.70
    },
    {
      instrument: "HINDUNILVR",
      qty: 1,
      avg: 2335.85,
      price: 2417.4,
      cost:2417.70
    },
    {
      instrument: "INFY",
      qty: 1,
      avg: 1350.5,
      price: 1555.45,
      cost:1555.45
    },
    {
      instrument: "ITC",
      qty: 5,
      avg: 202.0,
      price: 207.9,
      cost:1035.5
    },
    {
      instrument: "KPITTECH",
      qty: 5,
      avg: 250.3,
      price: 266.45,
      cost:1332.35
    },
    {
      instrument: "M&M",
      qty: 2,
      avg: 809.9,
      price: 779.8,
      cost:1559.6
    },
    {
      instrument: "RELIANCE",
      qty: 1,
      avg: 2193.7,
      price: 2112.4,
      cost:1442.5
    },
    {
      instrument: "SBIN",
      qty: 4,
      avg: 324.35,
      price: 430.2,
      cost:1720
    },
    {
      instrument: "SGBMAY29",
      qty: 2,
      avg: 4727.0,
      price: 4719.0,
      cost:9428.0
    },
    {
      instrument: "TATAPOWER",
      qty: 5,
      avg: 104.2,
      price: 124.15,
      cost:620.75
    },
    {
      instrument: "TCS",
      qty: 1,
      avg: 3041.7,
      price: 3194.8,
      cost:3145.76
    },
    {
      instrument: "WIPRO",
      qty: 4,
      avg: 489.3,
      price: 577.75,
      cost:2311.00
    },
  ];

async function addHolding() {
  try {
    console.log("MongoDB URI is:", process.env.ATLASDB_URL);
    await mongoose.connect(process.env.ATLASDB_URL);
    await Holding.deleteMany({});
    await Holding.insertMany(tempHoldings);
    console.log("✅ Holdings inserted successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.log("❌ Error:", err);
  }
}

addHolding();