const mongoose = require("mongoose");

const connectDB = async() =>{
    try{
        const connect = await mongoose.connect(process.env.MongoURL)
        console.log(`MongoDB Connected ${connect.connection.host}`);
    }catch(err){
        console.log(`error ${err.message}`);
    }
}

module.exports = connectDB;