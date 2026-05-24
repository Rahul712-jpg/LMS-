import express from "express";
import course from "../models/course.js";
import  {getCourseId,getAllCourses} from "../controllers/courseController.js";


const courseRouter=express.Router();

courseRouter.get('/all', getAllCourses);
courseRouter.get('/:courseId', getCourseId);

export default courseRouter;
