const mongoose=require('mongoose');
const mongoURI="mongodb://127.0.0.1:27017/inotebook"
mongoose.set("strictQuery", false);

const connectToMongo=async()=>{
    await mongoose.connect(mongoURI,{useNewUrlParser:true, useUnifiedTopology:true},()=>{
        console.log("Connected to mongo successfully");
    })
}

module.exports = connectToMongo;