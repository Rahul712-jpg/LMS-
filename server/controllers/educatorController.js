import { clerkClient } from "@clerk/express";
import course from "../models/course.js";
import { v2 as cloudinary } from "cloudinary";
import Purchase from "../models/purchase.js";
import User from "../models/User.js";

/* =========================================
   UPDATE ROLE TO EDUCATOR
========================================= */

export const updateRoleToEducator = async (req, res) => {

    try {

        const userId = req.auth.userId;

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: "educator",
            },
        });

        res.json({
            success: true,
            message: "You can publish courses now",
        });

    } catch (error) {

        res.json({
            success: false,
            message: error.message,
        });

    }
};

/* =========================================
   ADD COURSE
========================================= */

export const addCourse = async (req, res) => {

    try {

        console.log("Add Course Called");

        const { courseData } = req.body;

        const imageFile = req.file;

        if (!imageFile) {

            return res.json({
                success: false,
                message: "Thumbnail is not attached",
            });

        }

        // Find MongoDB user from Clerk ID
        const user = await User.findOne({
            clerkId: req.auth.userId,
        });

        if (!user) {

            return res.json({
                success: false,
                message: "User not found",
            });

        }

        // Parse course data
        const parsedCourseData = JSON.parse(courseData);

        // Store MongoDB ObjectId
        parsedCourseData.educator = user._id;

        // Create course
        const newCourse = await course.create(parsedCourseData);

        // Upload thumbnail
        const imageUpload = await cloudinary.uploader.upload(
            imageFile.path
        );

        // Save thumbnail URL
        newCourse.courseThumbnail = imageUpload.secure_url;

        await newCourse.save();

        res.json({
            success: true,
            message: "Course Added",
            data: newCourse,
        });

    } catch (error) {

        res.json({
            success: false,
            message: error.message,
        });

    }
};

/* =========================================
   GET EDUCATOR COURSES
========================================= */

export const getEducatorCourses = async (req, res) => {

    try {

        const user = await User.findOne({
            clerkId: req.auth.userId,
        });

        if (!user) {

            return res.json({
                success: false,
                message: "User not found",
            });

        }

        const courses = await course.find({
            educator: user._id,
        });

        res.json({
            success: true,
            courses,
        });

    } catch (error) {

        res.json({
            success: false,
            message: error.message,
        });

    }
};

/* =========================================
   EDUCATOR DASHBOARD DATA
========================================= */

export const eduactorDashboardData = async (req, res) => {

    try {

        // Find MongoDB user
        const user = await User.findOne({
            clerkId: req.auth.userId,
        });

        if (!user) {

            return res.json({
                success: false,
                message: "User not found",
            });

        }

        // Get educator courses
        const courses = await course.find({
            educator: user._id,
        });

        const totalCourses = courses.length;

        const courseIds = courses.map(
            (course) => course._id
        );

        // Get purchases
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: "completed",
        });

        // Total earnings
        const totalEarnings = purchases.reduce(
            (sum, purchase) => sum + purchase.amount,
            0
        );

        // Students data
        const enrolledStudentsData = [];

        for (const item of courses) {

            const students = await User.find({
                _id: { $in: item.enrolledStudents },
            }).select("name image");

            students.forEach((student) => {

                enrolledStudentsData.push({
                    courseTitle: item.courseTitle,
                    student,
                });

            });
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses,
            },
        });

    } catch (error) {

        res.json({
            success: false,
            message: error.message,
        });

    }
};

/* =========================================
   GET ENROLLED STUDENTS
========================================= */

export const getEnrolledStudents = async (req, res) => {

    try {

        // Find Mongo user
        const user = await User.findOne({
            clerkId: req.auth.userId,
        });

        if (!user) {

            return res.json({
                success: false,
                message: "User not found",
            });

        }

        // Get educator courses
        const courses = await course.find({
            educator: user._id,
        });

        const courseIds = courses.map(
            (course) => course._id
        );

        // Purchases
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: "completed",
        })
            .populate("userId", "name image")
            .populate("courseId", "courseTitle");

        // Format response
        const enrolledStudents = purchases.map(
            (purchase) => ({
                student: purchase.userId,
                courseTitle: purchase.courseId.courseTitle,
                purchaseDate: purchase.createdAt,
            })
        );

        res.json({
            success: true,
            enrolledStudents,
        });

    } catch (error) {

        res.json({
            success: false,
            message: error.message,
        });

    }
};