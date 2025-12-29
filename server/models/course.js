import mongoose from "mongoose";
// import { IsomorphicFetchHttpLibrary } from "svix/dist/openapi";


const lectureSchema=new mongoose.Schema({
    lectureId:{type:String,required:true},
    lectureTitle:{type:String,required:true},
    lectureDuration:{type:Number,required:true},
    lecturUrl:{type:String,required:true},
    isPreviewFree:{type:Boolean,required:true},
    lectureOrder:{type:Number,required:true},
},{_id:false});

const chapterSchema=new mongoose.Schema({
    chaperId:{type:String,required:true},
    chaterOrder:{type:Number,required:true},
    chaterTitle:{type:String,required:true},
    chaterContent:[lectureSchema],
},{_id:false});

const courseSchema=new mongoose.Schema({
    courseTitle:{type:String,required:true},
    courseDescription:{type:String,required:true},
    courseThumnail:{type:String},
    coursePrice:{type:String,required:true},
    isPublished:{type:Boolean,default:true},
    discount:{type:Number,required:true,min:0,max:100},
    courseContent:[chapterSchema],
    courseRatings:[{userId:{type:String},rating :{type:Number,min:1,max:5}}],
    educator:{type:String ,ref:'User',required:true},
    enrolledStudents:[{type:String,ref:'User'}],
},{timestamps:true,minimize:false})

const course=mongoose.model('Course',courseSchema)

export default course;