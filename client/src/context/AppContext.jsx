import { createContext,useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration";
import {data, useNavigate} from "react-router-dom";
import { useAuth,useUser } from "@clerk/clerk-react";
import axios from "axios";
 import { ToastContainer, toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl=import.meta.env.VITE_BACKEND_URL ;
  // console.log("BACKEND URL 👉", import.meta.env.VITE_BACKEND_URL);


  const currency = import.meta.env.VITE_CURRENCY || '₹';



  const navigate=useNavigate();

  const {getToken}=useAuth();
  const{user}=useUser()

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData,setuserData]=useState(null);


  const fetchAllCourses = async () => {
    
    try{
      const {data}=await axios.get(backendUrl +'/api/course/all');
      if(data.success){
        setAllCourses(data.courses);
      }else{
        toast.error(data.message);
      }

    }catch(error){
      toast.error(error.message);

    }
  };

  const fetchUserData=async()=>{

    if(user.publicMetadata.role==='educator'){
      setIsEducator(true);
    }
    try{
      const token=await getToken();
      const {data}=await axios.get(backendUrl + '/api/user/data',{headers:{
        Authorization:`Bearer ${token}`
      }})
      if(data.success){
        setuserData(data.user);
      }else{
        toast.error(data.message);
      }
    }
    catch(error){
     toast.error(error.message);
    }
  }

    
    
  
  const calculateRating = (course) => {
    if (!course?.courseRatings?.length) return 0;
    const total = course.courseRatings.reduce(
      (sum, r) => sum + r.rating, 0
    );
    return Math.floor(total / course.courseRatings.length);
  };

  const calculateChapterTime = (chapter) => {
    if (!chapter?.chapterContent) return "0m";
    const time = chapter.chapterContent.reduce(
      (sum, lecture) => sum + lecture.lectureDuration, 0
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateCourseDuration = (course) => {
    if (!course?.courseContent) return "0m";
    let time = 0;
    course.courseContent.forEach(chapter => {
      chapter.chapterContent?.forEach(
        lecture => time += lecture.lectureDuration
      );
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateNoOfLectures = (course) => {
    if (!course?.courseContent) return 0;
    return course.courseContent.reduce(
      (total, chapter) =>
        total + (chapter.chapterContent?.length || 0),
      0
    );
  };

  const fetchUserEnrolledCourses = async () => {

    try{
       const token = await getToken();
    const {data}=await axios.get(backendUrl + '/api/user/enrolled-courses',{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    if(data.success){
      setEnrolledCourses(data.enrolledCourses.reverse());
    }else{
      toast.error(data.message);
    }
    }catch(error){
      toast.error(error.message);
    }
   
  };


  useEffect(() => {
    if(user){
      fetchUserData();
      fetchUserEnrolledCourses();
  }},[user])

  const logToken=async()=>{
    console.log(await getToken());
  }
  
   useEffect(() => {
    if(user){
      logToken()
    }
    
  }, [user]);
 

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
    backendUrl,userData,setuserData,getToken,fetchAllCourses
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
