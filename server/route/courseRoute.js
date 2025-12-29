import express from "express";
// import course from "../models/course";
// import { getCourseId } from "../controllers/courseController";


const courseRouter=express.Router();

courseRouter.get('/all',getAllCourses);
courseRouter.get('/:id',getCourseId);

export default courseRouter;
