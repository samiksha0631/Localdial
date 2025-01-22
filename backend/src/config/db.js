const mongoose= require('mongoose');

const connectDB = async () =>{
    try{
         mongoose.connect(process.env.MONGO_URI);
         console.log("MongoDB Connected");
    } catch (error){
        console.log("MongoDB connection Failed",error.message);
        process.exit(1);
    }
};

module.exports=connectDB;