import express from 'express';
import { addUserRating, getUserCourseProgress, getUserData,purchaseCourse,UserEnrolledCourses } from '../controllers/userController.js'
import { updateUserCourseProgress } from '../controllers/userController.js';


const userRouter=express.Router();
console.log('hello')
userRouter.get('/data', getUserData)

userRouter.get('/enrolled-courses' ,UserEnrolledCourses)
userRouter.post('/purchase' ,purchaseCourse)
userRouter.post('/update-course-progress' ,updateUserCourseProgress)
userRouter.post('/get-course-progress' ,getUserCourseProgress)
userRouter.post('/add-rating' ,addUserRating)

export default userRouter;