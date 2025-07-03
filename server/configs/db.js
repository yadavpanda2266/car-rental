import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected',()=> console.log("Database connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`);
        console.log("Database connected");
    } catch (error) {
        console.log(error.message);
        console.log("Database connection failed");
        
    }
}

export default connectDB;