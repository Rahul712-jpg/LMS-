import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { useState } from 'react'
import {useParams} from 'react-router-dom'
import { assets } from '../../assets/assets'
import {humanizeDuration}  from 'humanize-duration'
import Youtube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'


const Player = () => {

  const {enrolledCourses,calculateChapterTime,backendUrl, getToken,userData,fecthUserEnrolledCourses}=useContext(AppContext)
  const {courseId}=useParams()
  const {courseData,setCourseData}=useState(null)
  const {openSection,setOpenSectio}=useState({})
  const {playerData,setPlayerData}=useState(null)

  const [progressData,setProgressData]=useState(null);
  const [intialRating,setIntialRating]=useState(0);
  


  const getCourseData=()=>{
    enrolledCourses.map((course)=>{
      if(course._id=== courseId){
        setCourseData(course)
        course.courseRatings.map((rating)=>{
          if(item.userId===userData._id){
          setIntialRating(item.rating)
        }
      })
      }
    })
  }

  const toggleSection=(index)=>{
     setOpenSection((prev)=>(
          { ...prev,[index]:!prev[index],}
          
     ));
  };
 useEffect(()=>{
  if(enrolledCourses.length>0){
  getCourseData()}
 },[enrolledCourses])




 const markLectureAsComplete=async(lectureId)=>{
  try{
    const token=await getToken();
    const {data}=await axois.post(backendUrl + '/api/user/mark-lecture-complete',{
      courseId:courseData._id,
      lectureId
    },{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    if(data.success){
      toast.success(data.message);
    }
  }catch(error){
    toast.error(error.message);
  }
 }

const getCourseProgress=async()=>{
    try{
      const token=await getToken();
      const {data}=await axois.post(backendUrl + `/api/user/get-course-progress`,{courseId
       },{headers:{
        Authorization:`Bearer ${token}`
      }})
      if(data.success){
        setProgressData(data.progressData)
        getCourseProgress()
      }else{
        toast.error(data.message)
      }

    }catch(error){ 
      toast.error(error.message)

    }
}

const handlerate=async ()=>{
  try{
  const token=await getToken()
  const {data}=await axois.post(backendUrl + '/api/user/add-rating',{courseId,rating},{headers:{
        Authorization:`Bearer ${token}`
      }})
      if(data.success){
        toast.success(data.message)
        fecthUserEnrolledCourses()
      }else{
        toast.error(data.message)
      }

  }catch(error){
    toast.error(error.message)

  }
}
useEffect(()=>{
   getCourseProgress()
},[])


  return courseData ? (
    <>
    <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
      {/* {left column} */}
      <div className='text-gray-800'>
        <h2 className='text-xl font-semibold'>Course Structure</h2>
        <div className='pt-5'>
          { courseData && courseData.courseContent.map((chapter,index)=>(
            <div key={index} className='border border-gray-300 bg-white mg-2 rounded'>
          <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' onClick={()=>toggleSection(index)}>
          <div className='flex items-center gap-2'>
            <img  className={`transform-transition-transform ${openSection[index] ?'rotate-180' :''}`}src={assets.down_arrow_icon} alt="arrow icon" />
                  <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                  </div>
                <p className='text-sm md:text-default'>{chapter.chapterContent.length}lectures-{calculateChapterTime(chapter)}</p>
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${openSection[index]? 'max-h-96':'max-h-0'}`}>
                <ul className='list-disk md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300 '>
                  {chapter.chapterContent.map((lecture,i)=>(
                    <li key={i} className='flex items-start gap-2 py-1'>
                      <img src={progressData && progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon:assets.play_icon} alt="Play Icon" className='w-4 h-4 mt-1' />
                      <div className='flex items-center justify-between w-full text-gray-300 text-xs md:text-default'>
                      <p>{lecture.lectureTitle}</p>
                      <div className='flex gap-2'>
                      {lecture.lectureUrl && <p 
                      onClick={()=>setPlayerData({
                        ...lecture,chapter:index+1,lecture:i+1

                      })}className='test-blue-500 cursor-pointer'>Watch</p>}
          <p>
            {humanizeDuration(lecture.lectureDuration*60*1000,{units:["h","m"]})}
          </p>
            
          </div>
        </div>
      </li>
                    
  ))}
  </ul>
  </div>
  </div>
))}
</div>
      <div className='flex items-center gap-2 py-3 mt-10'>
        <h1 className='text-xl font-bold'>Rate The Course:</h1>
        <Rating intialRating={intialRating} onRate={handlerate}/>


      </div>
      </div>
      {/* {right column} */}
      <div className='md:mt-10'>
        {
          playerData ?(
            <div >
              <YouTube videoId={playerData.lectureUrl.split('/').pop()}  iframeClassName='w-full aspect-video'/>
                          
                <div className='flex justify-between items-center mt-1'>
                  <p>{playerData.chapter}.{playerData.lecture}{playerData.lectureTitle}</p>
                 <button onclick={()=>markLectureAsComplete(playerData.lectureId)}className='text-blue-600'>{progressData && progressData.lectureCompleted.includes(playerData.lectureId) ?'Completed':'Mark Completed'}</button>
                </div>
              </div>
          )
        :
        <img src={courseData ? courseData.courseThumbnail:''} alt="" />}
      </div>
    </div>
    <Footer/>
</>
  ):<Loading/>
}

export default Player
