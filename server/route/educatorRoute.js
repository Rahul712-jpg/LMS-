import express from "express";
import { eduactorDashboardData, updateRoleToEducator } from "../controllers/educatorController.js";
import { protectEducator } from "../middlewares/authMiddelware.js";
import { get } from "mongoose";
import {addCourse, getEducatorCourses,getEnrolledStudents} from "../controllers/educatorController.js"
import upload from "../utils/multer.js";

const educatorRouter=express.Router();

// Route to update user role to educator
educatorRouter.get('/update-role',updateRoleToEducator);
educatorRouter.post('/add-course',upload.single('image'),protectEducator ,addCourse);

educatorRouter.get('/courses',protectEducator,getEducatorCourses);
educatorRouter.get('/dashboard',protectEducator,eduactorDashboardData);
educatorRouter.get('/enrolled-students',protectEducator,get);



export default educatorRouter;  