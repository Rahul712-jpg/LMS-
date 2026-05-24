import course from "../models/course.js";

/* =========================================
   GET ALL COURSES
========================================= */

export const getAllCourses = async (req, res) => {

    try {

        const courses = await course
            .find({ isPublished: true })
            .populate("educator");

        res.json({
            success: true,
            courses
        });

    } catch (error) {

        res.json({
            success: false,
            message: error.message
        });

    }
};

/* =========================================
   GET COURSE BY ID
========================================= */

export const getCourseId = async (req, res) => {

    const { courseId } = req.params;

    try {

        const courseData = await course
            .findById(courseId)
            .populate("educator");

        if (!courseData) {

            return res.json({
                success: false,
                message: "Course not found"
            });

        }

        // Hide non-preview lecture URLs
        courseData.courseContent.forEach((chapter) => {

            chapter.chapterContent.forEach((lecture) => {

                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = undefined;
                }

            });

        });

        res.json({
            success: true,
            courseData
        });

    } catch (error) {

        res.json({
            success: false,
            message: error.message
        });

    }
};