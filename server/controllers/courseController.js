import course from "../models/course.js";



// get all coursee

export const getAllCourses = async (req, res) => {
    try {

        const courses = await course
            .find({ isPublished: true })
            .select('-courseContent') // only exclude courseContent
            .populate('educator')

        res.json({
            success: true,
            courses
        })

    } catch (error) {

        res.json({
            success: false,
            message: error.message
        })
    }
}
// get course by id
export const getCourseId=async(req,res)=>{
    const {courseId}=req.params;
    try{
        const courseData=await Course.findById(courseId).populate({path:'educator'});

        courseData.courseContent.forEach(chapter=>{
            chapter.chapterContent.forEach(lecture=>{
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl=undefined;
                }
            })
        })
        res.json({success:true,courseData})
    }catch(error){
        res.json({success:false,message:error.message})

    }
    
    
}

