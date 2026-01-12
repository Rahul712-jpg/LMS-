import User from "../models/User.js";
import Course from "../models/course.js";
import Purchase from "../models/purchase.js";
// import CourseProgress from "../models/courseProgress.js";
import { EventTypeImportOpenApiIn } from "svix";
import Stripe from "stripe";

/* -----------------------------------
   GET /user/data
   Auto-create user if not exists
----------------------------------- */
export const getUserData = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    // 1️⃣ Get full user from Clerk
    const clerkUser = await clerkClient.users.getUser(clerkId);

    // 2️⃣ Find user in MongoDB
    let user = await User.findOne({ clerkId });

    // 3️⃣ Create if not exists (WITH REAL DATA)
    if (!user) {
      user = await User.create({
        clerkId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        image: clerkUser.imageUrl || "",
        enrolledCourses: [],
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -----------------------------------
   GET /user/enrolled-courses
----------------------------------- */
export const UserEnrolledCourses = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId }).populate("enrolledCourses");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      enrolledCourses: user.enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -----------------------------------
   POST /user/purchase
----------------------------------- */
export const purchaseCourse = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { courseId } = req.body;
    const { origin } = req.headers;

    const user = await User.findOne({ clerkId });
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.json({ success: false, message: "Invalid user or course" });
    }

    const amount =
      course.coursePrice -
      (course.discount * course.coursePrice) / 100;

    const purchase = await Purchase.create({
      userId: user._id,
      courseId: course._id,
      amount,
    });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: [
        {
          price_data: {
            currency: (process.env.CURRENCY || "usd").toLowerCase(),
            product_data: { name: course.courseTitle },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        purchaseId: purchase._id.toString(),
      },
    });

    res.json({ success: true, sessionUrl: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -----------------------------------
   POST /user/update-course-progress
----------------------------------- */
export const updateUserCourseProgress = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { courseId, lectureId } = req.body;

    const user = await User.findOne({ clerkId });
    if (!user) return res.json({ success: false, message: "User not found" });

    let progress = await CourseProgress.findOne({
      userId: user._id,
      courseId,
    });

    if (!progress) {
      progress = await CourseProgress.create({
        userId: user._id,
        courseId,
        lectureCompleted: [lectureId],
      });
    } else if (!progress.lectureCompleted.includes(lectureId)) {
      progress.lectureCompleted.push(lectureId);
      await progress.save();
    }

    res.json({ success: true, message: "Progress updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -----------------------------------
   POST /user/get-course-progress
----------------------------------- */
export const getUserCourseProgress = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { courseId } = req.body;

    const user = await User.findOne({ clerkId });
    if (!user) return res.json({ success: false, message: "User not found" });

    const progress = await CourseProgress.findOne({
      userId: user._id,
      courseId,
    });

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -----------------------------------
   POST /user/add-rating
----------------------------------- */
export const addUserRating = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { courseId, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Invalid rating" });
    }

    const user = await User.findOne({ clerkId });
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.json({ success: false, message: "Invalid user or course" });
    }

    if (!user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: "User not enrolled in course",
      });
    }

    const existing = course.courseRatings.find(
      (r) => r.userId.toString() === user._id.toString()
    );

    if (existing) {
      existing.rating = rating;
    } else {
      course.courseRatings.push({ userId: user._id, rating });
    }

    await course.save();

    res.json({ success: true, message: "Rating added" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
