const mongoose=require('mongoose');
const mongoURI="mongodb+srv://gaumata:bflmuXuvHMgcgBQk@cluster0.fvvekhf.mongodb.net/"
mongoose.set("strictQuery", false);

const connectToMongo=async()=>{
    await mongoose.connect(mongoURI,{useNewUrlParser:true, useUnifiedTopology:true},()=>{
        console.log("Connected to mongo successfully");
    })
}

module.exports = connectToMongo;