import React, { use, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';
import YouTube from 'react-youtube';
import humanizeDuration from 'humanize-duration';
import axois from 'axios';
import { toast } from 'react-toastify';

const CourseDetail = () => {

  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);


  const [playerData, setPlayerData] = useState(null);

  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calcuateNoOfLectures,
    currency,backendUrl,userData,getToken
  } = useContext(AppContext);

     const fetchCourseData = async () => {
      try{
          const data=await axois(backendUrl + `/api/courses/${id}`);

          if(data.success){
            setCourseData(data.course);
      }else{
        toast.error(data.message);
      }}
      catch(error){
        toast.error(error.message);
      }
        
     }

  const enrolledCourse=async()=>{
    try{
      if(!userData)return toast.error("User data not found");
      if(isAlreadyEnrolled){
        return toast.warn("Already enrolled in this course"); 
      }
   const token=await getToken();
   const {data}=await axois.post(backendUrl + '/api/user/purchase',{
    courseId:courseData._id
   },{
    headers:{
      Authorization:`Bearer ${token}`
    }
   })
   if(data.success){  
    const {session_url}=data;
    window.location.replace(session_url);
   }else{
    toast.error(data.message);
   }
    }
    catch(error){
      toast.error(error.message);
    }
  }
  useEffect(() => {
    fetchCourseData();
  }, []);

  useEffect(() => {
    if(userData && courseData){
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
   }
  },[userData,courseData])



  const toggleSection = index => {
    setOpenSection(prev => ({ ...prev, [index]: !prev[index] }));
  };

  if (!courseData) return <Loading />;

  return (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative md:px-36 px-8 md:pt-32 pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-100/70 -z-10"></div>

        {/* LEFT */}
        <div className="max-w-xl text-gray-500">
          <h1 className="text-2xl md:text-4xl font-semibold text-gray-800">
            {courseData.courseTitle}
          </h1>

          <p
            className="pt-4 text-sm md:text-base"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}
          />

          <div className="flex items-center gap-2 pt-3 text-sm">
            <p>{calculateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating(courseData))
                      ? assets.star
                      : assets.star_blank
                  }
                  className="w-3.5 h-3.5"
                  alt=""
                />
              ))}
            </div>
            <p className="text-gray-600">
              ({courseData.courseRatings.length} ratings)
            </p>
            <p className="text-gray-600">
              {courseData.enrolledStudents.length} students
            </p>
          </div>
            <p className='text-sm'>Course by<span className='text-blue-600 underline'>{
              courseData.educator.name}</span></p>
          <div className="pt-8">
            <h2 className="text-xl font-semibold">Course Structure</h2>

            {courseData.courseContent.map((chapter, index) => (
              <div key={index} className="border bg-white m-2 rounded">
                <div
                  className="flex justify-between p-4 cursor-pointer"
                  onClick={() => toggleSection(index)}
                >
                  <p className="font-medium">{chapter.chapterTitle}</p>
                  <p className="text-sm">
                    {chapter.chapterContent.length} lectures ·{' '}
                    {calculateChapterTime(chapter)}
                  </p>
                </div>

                {openSection[index] && (
                  <ul className="list-disc pl-6 py-2 border-t">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className="flex justify-between text-sm">
                        <span>{lecture.lectureTitle}</span>
                        <div className="flex gap-2">
                          {lecture.isPreviewFree && (
                            <span
                              onClick={() =>
                                setPlayerData({
                                  videoId:
                                    lecture.lectureUrl.split('/').pop(),
                                })
                              }
                              className="text-blue-500 cursor-pointer"
                            >
                              Preview
                            </span>
                          )}
                          <span>
                            {humanizeDuration(
                              lecture.lectureDuration * 60000,
                              { units: ['h', 'm'] }
                            )}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded shadow min-w-[320px]">
          {playerData ? (
            <YouTube
              videoId={playerData.videoId}
              opts={{ playerVars: { autoplay: 1 } }}
              className="w-full aspect-video"
            />
          ) : (
            <img src={courseData.courseThumbnail} alt="" />
          )}

          <div className="p-5">
            <p className="text-2xl font-semibold text-gray-800">
              {currency}
              {(
                courseData.coursePrice -
                (courseData.discount * courseData.coursePrice) / 100
              ).toFixed(2)}
            </p>

            <button onclick={enrolledCourse}className="mt-4 w-full py-3 bg-blue-600 text-white rounded">
              {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
            </button>

            <div className="pt-4 text-sm text-gray-500">
              <p>⏱ {calculateCourseDuration(courseData)}
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Lorem ipsum dolor sit amet.</li>
              </p>
              <p>📘 {calcuateNoOfLectures(courseData)} Lessons</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CourseDetail;
