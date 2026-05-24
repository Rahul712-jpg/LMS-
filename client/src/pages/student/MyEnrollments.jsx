

import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { Line } from 'rc-progress';
import Footer from '../../components/student/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; 


const MyEnrollment = () => {
  const { enrolledCourses, calculateCourseDuration,userData,fetchUserEnrolledCourses,backendUrl,getToken,calculateNoOfLectures} = useContext(AppContext);
  const navigate = useNavigate();

  const [progressArray,setProgressArray] = useState([
      
  ]);
  const getCourseProgress=async()=>{
    try{
      const token=await getToken();
      const tempProgressArray=await Promise.all(enrolledCourses.map(async(course)=>{
        const {data}=await axios.post(backendUrl + `/api/user/get-course-progress`,{courseId:
          course._id},{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })
        let totalLectures=calculateNoOfLectures(course);

        const lectureCompleted=data.progressData ? data.progressData.lecturesCompleted.length :0;
        return {lectureCompleted,totalLectures};
      }))
      setProgressArray(tempProgressArray);

        

    }
    catch(error){
      toast.error(error.message);

    }
  }
  useEffect(()=>{
    if(userData){
      fetchUserEnrolledCourses();
    }
  },[userData]);
  useEffect(()=>{
    if(enrolledCourses.length>0){
      getCourseProgress();
    }
  },[enrolledCourses ]);

  return (
    <>
      <div className='md:px-36 px-8 pt-10'>
        <h1 className='text-2xl font-semibold'>My Enrollments</h1>

        <table className='w-full border mt-10'>
          <thead className='border-b text-sm text-left max-sm:hidden'>
            <tr>
              <th className='px-4 py-3'>Course</th>
              <th className='px-4 py-3'>Duration</th>
              <th className='px-4 py-3'>Completed</th>
              <th className='px-4 py-3'>Status</th>
            </tr>
          </thead>

          <tbody className='text-gray-700'>
            {enrolledCourses.map((course, index) => {
              const progress =
                progressArray[index] || { lectureCompleted: 0, totalLectures: 1 };

              const percent =
                (progress.lectureCompleted * 100) / progress.totalLectures;

              return (
                <tr key={course._id} className='border-b'>
                  <td className='px-4 py-3 flex items-center gap-3'>
                    <img
                      src={course.courseThumbnail}
                      alt=''
                      className='w-20'
                    />
                    <div className='flex-1'>
                      <p className='mb-1'>{course.courseTitle}</p>
                      <Line
                        strokeWidth={2}
                        percent={percent}
                        className='bg-gray-300 rounded-full'
                      />
                    </div>
                  </td>

                  <td className='px-4 py-3 max-sm:hidden'>
                    {calculateCourseDuration(course)}
                  </td>

                  <td className='px-4 py-3 max-sm:hidden'>
                    {progress.lectureCompleted}/{progress.totalLectures} Lectures
                  </td>

                  <td className='px-4 py-3 text-right'>
                    <button
                      className='px-4 py-2 bg-blue-600 text-white text-sm'
                      onClick={() => navigate(`/player/${course._id}`)}
                    >
                      {progress.lectureCompleted / progress.totalLectures === 1
                        ? 'Completed'
                        : 'Ongoing'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Footer />
    </>
  );
};

export default MyEnrollment;
