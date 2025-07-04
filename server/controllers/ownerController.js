import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

export const changeRoleToOwner = async(req, res)=>{
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role:"owner"})
        res.json({success:true, message:" Now you can list cars"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

// API to list cars

export const addCar = async(req, res)=>{
    try {
        const {_id} = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;
 
        //upload image to imagekit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder:'/cars'
        })

         // For URL Generation, works for both images and videos
        var optimizedImageURL = imagekit.url({
        path : response.filePath,
        transformation : [
            {width:'1280'}, //resize image
            {quality:'auto'}, //auto compression
            {format:'webp'}, //convert to modern format
        ]
});
         
    const image = optimizedImageURL;
    await Car.create({...car,owner:_id,image})
    res.json({success:true, message:"Car added successfully"})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

//API to list cars
export const getOwnerCars = async(req, res)=>{
    try {
        const {_id} = req.user;
        const cars = await Car.find({owner:_id});
        res.json({success:true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}
//API to Toggle car availability
export const toggleCarAvailability = async(req, res)=>{
    try {
        const {_id} = req.user;
        const {carId} = req.body;
        const car = await Car.findById(carId);

        //checking is  car belongs to user
        if(car.owner.toString() !== _id.toString()){
            return res.json({success:false, message:" Unauthorized"})
        }
        car.isAvailable = !car.isAvailable;
        await car.save();

        res.json({success:true, message:"Availability toggled "})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}
//API to delete car
export const deleteCar = async(req, res)=>{
    try {
        const {_id} = req.user;
        const {carId} = req.body;
        const car = await Car.findById(carId);

        //checking is  car belongs to user
        if(car.owner.toString() !== _id.toString()){
            return res.json({success:false, message:" Unauthorized"})
        }
        car.owner = null;
        car.isAvailable = false;
        await car.save();

        res.json({success:true, message:"Car deleted successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

//api to dashboard data
export const getDashboardData = async(req, res)=>{
    try {
        const {_id} = req.user;

        if (req.user.role !== "owner") {
            return res.json({success:false, message:"Unauthorized"})
        }

        const cars = await Car.find({owner:_id});
        const bookings = await Booking.find({owner:_id}).populate('car').sort({createdAt: -1})

        const pendingBookings = await Booking.find({owner:_id, status:"pending"})
        const completedBookings = await Booking.find({owner:_id, status:"confirmed"})
         
        //calculate monthly revenue from bookings where status is confirmed
        const monthlyRevenue = bookings.slice().filter(booking=>booking.status === "confirmed").
        reduce((acc,booking)=>acc + booking.price,0)

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0,3),
            monthlyRevenue
        }

        res.json({success:true, dashboardData});

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

// API to update user image
export const updateUserImage = async(req, res)=>{
    try {
        const {_id} = req.user;

        const imageFile = req.file;
 
        //upload image to imagekit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder:'/users'
        })

         // For URL Generation, works for both images and videos
        var optimizedURL = imagekit.url({
        path : response.filePath,
        transformation : [
            {width:'400'}, //resize image
            {quality:'auto'}, //auto compression
            {format:'webp'}, //convert to modern format
        ]
});
     const image = optimizedURL;

     await User.findByIdAndUpdate(_id, {image})
     res.json({success:true, message:"Image updated successfully"})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}