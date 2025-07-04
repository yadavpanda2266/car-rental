import express from "express";
import { getUserData, registerUser, loginUser, getCars } from "../controllers/UserController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserData);
userRouter.get('/cars', getCars)

export default userRouter;



