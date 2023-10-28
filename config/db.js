const mongoose = require("mongoose");
const URI = process.env.MONGODB_URI

mongoose.connect(URI).then((res) => {
    console.log("MongoDB Connected!");
}).catch((err) => {
    console.log("MongoDB connection failed");
})