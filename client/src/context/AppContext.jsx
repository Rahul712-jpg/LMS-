import { createContext, useEffect, useState } from "react";
import humanizeDuration from "humanize-duration";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  // ================= FETCH ALL COURSES =================

  const fetchAllCourses = async () => {
    try {

      console.log("Backend URL:", backendUrl);

      const { data } = await axios.get(
        backendUrl + "/api/courses/all"
      );

      console.log("Courses Response:", data);

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ================= FETCH USER DATA =================

  const fetchUserData = async () => {

    if (user?.publicMetadata?.role === "educator") {
      setIsEducator(true);
    }

    try {

      const token = await getToken();

      const { data } = await axios.get(
        backendUrl + "/api/user/data",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ================= FETCH ENROLLED COURSES =================

  const fetchUserEnrolledCourses = async () => {

    try {

      const token = await getToken();

      const { data } = await axios.get(
        backendUrl + "/api/user/enrolled-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ================= CALCULATE FUNCTIONS =================

  const calculateRating = (course) => {

    if (!course?.courseRatings?.length) return 0;

    const total = course.courseRatings.reduce(
      (sum, r) => sum + r.rating,
      0
    );

    return Math.floor(total / course.courseRatings.length);
  };

  const calculateChapterTime = (chapter) => {

    if (!chapter?.chapterContent) return "0m";

    const time = chapter.chapterContent.reduce(
      (sum, lecture) => sum + lecture.lectureDuration,
      0
    );

    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
    });
  };

  const calculateCourseDuration = (course) => {

    if (!course?.courseContent) return "0m";

    let time = 0;

    course.courseContent.forEach((chapter) => {
      chapter.chapterContent?.forEach((lecture) => {
        time += lecture.lectureDuration;
      });
    });

    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
    });
  };

  const calculateNoOfLectures = (course) => {

    if (!course?.courseContent) return 0;

    return course.courseContent.reduce(
      (total, chapter) =>
        total + (chapter.chapterContent?.length || 0),
      0
    );
  };

  // ================= LOAD ALL COURSES =================

  useEffect(() => {
    fetchAllCourses();
  }, []);

  // ================= LOAD USER DATA =================

  useEffect(() => {

    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }

  }, [user]);

  // ================= DEBUG TOKEN =================

  const logToken = async () => {
    console.log(await getToken());
  };

  useEffect(() => {

    if (user) {
      logToken();
    }

  }, [user]);

  // ================= CONTEXT VALUE =================

  const value = {
    currency,
    allCourses,
    isEducator,
    setIsEducator,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
    navigate,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};