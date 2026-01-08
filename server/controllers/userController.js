import course from "../models/course.js";
import Purchase from "../models/purchase.js"
import { EventTypeImportOpenApiIn } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";


export const getUserData=async(req,res)=>{
    try{
        const userId=req.auth.userId;
        const user=await User.findById(userId)

        if(!user){
            return res.json({success:false,message:"User not found"})
        }
        res.json({success:true,user})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

// user enrolled course

export const UserEnrolledCourses=async(req,res)=>{
    try{
       const userId=req.auth.userId;
       const userdata=await User.findById(userId).populate('enrolledCourses');

       res.json({success:true,enrolledCourses:userdata.enrolledCourses})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

export const purchaseCourse=async(req,res)=>{
    try{
        const {courseId}=req.body;
        const userId=req.auth.userId;
        const {origin}=req.headers;
        const userData=await User.findById(userId);
        const courseData=await Course.findById(courseId);

        if(!userData || !courseData){
            return res.json({success:false,message:"Invalid user or course data"})
        }
        const purchaseData={
             courseId:courseData._id,
             userId:userData._id,
             amount:(courseData.coursePrice - courseData.discount*courseData.coursePrice/100).toFixed(2),
        }
        const newPurchase=await Purchase.create(purchaseData);

        const strikeInstance=new Stripe(process.env.STRIPE_SECRET_KEY);
        const currency=process.env.CURRENCY.toLowerCase() || 'USD';

        const line_items=[{
            price_data:{
                currency,
                product_data:{
                    name:courseData.courseTitle,
                },
                unit_amount:Math.floor(newPurchase.amount*100),
            },
            quantity :1

        }]
        const session=await strikeInstance.checkout.sessions.create({
            success_url:`${origin}/loading/my-enrollments`,
            cancel_url:`${origin}/`,
            line_items:line_items,
            mode:'payment',
            metadata:{
                purchaseId:newPurchase._id.toString(),
            }
        })
        res.json({success:true,sessionUrl:session.url})

    }catch(error){
        res.json({success:false,message:error.message})
    }
}

// 

 export const updateUserCourseProgress=async(req,res)=>{
    try{
        const userId=req.auth.userId;
        const {courseId,lectureId}=req.body;
        const progressData=await CourseProgress.findOne({userId,courseId});

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success:true,message:"Lecture already completed"})
            }
            progressData.lectureCompleted.push(lectureId);
            await progressData.save();
            
                }
             else{
                await courseProgress.create({
                    userId,
                    courseId,
                    lectureCompleted:[lectureId],
                })
               
            }
            res.json({success:true,message:"Course progress updated"  });
            }
            
             catch(error){
        res.json({success:false,message:error.message})
    }
}

// get user course progress

 export const getUserCourseProgress=async(req,res)=>{
    try{
        const userId=req.auth.userId;
        const {courseId}=req.body;
        const progressData=await CourseProgress.findOne({userId,courseId});
        res.json({success:true,progressData});
    }catch(error){  
        res.json({success:false,message:error.message})
    }
}

// ADD user rating to course

export const addUserRating=async(req,res)=>{
    const userId=req.auth.userId;
    const {courseId,rating}=req.body;

    if(!courseId || !userId || !rating || rating<1 || rating>5){
        return res.json({success:false,message:"Invalid input data"})
    }

    try{
        const courseData=await Course.findById(courseId);
        if(!courseData){
            return res.json({success:false,message:"Course not found"});
    }

    const user=await user.findById(userId);
    if(!user || !user.enrolledCourses.includes(courseId)){
         return res.json({success:false,message:"User not enrolled in the course"});
    }
    const existingRatingIndex=course.courseRatings.findIndex(r=>r.userId.toString()===userId);

    if(existingRatingIndex>-1){
        course.courseRatings[existingRatingIndex].rating=rating;
    }else{
        course.courseRatings.push({userId,rating});
    }
    await courseData.save();

    return res.json({success:true,message:"Rating added successfully"});
    
}catch(error){
        res.json({success:false,message:error.message})
    }
}

