import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import Loading from '../../components/student/Loading'
import { toast } from 'react-toastify'


const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)

  const {
    currency,
    calculateCourseDuration,
    backendUrl,
    isEducator,
    getToken
  } = useContext(AppContext)

  const fetchDashboardData = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.get(
        backendUrl + '/api/educator/dashboard',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
// console.log("FULL RESPONSE:", data)
      if (data.success) {
        setDashboardData(data)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }
 
// console.log("isEducator:", isEducator)
  useEffect(() => {
    if (isEducator) {
      fetchDashboardData()
    }
  }, [isEducator])
  // console.log("dashboardData:", dashboardData)
  if (!dashboardData) return <Loading />
  // console.log('dashboardData')
  return (
    <div className='min-h-screen flex flex-col gap-8 p-4 md:p-8'>
      {/* Stats */}
      <div className='flex flex-wrap gap-5'>
        <div className='flex items-center gap-3 border p-4 w-56 rounded-md'>
          <img src={assets.patients_icon} alt='' />
          <div>
            <p className='text-2xl font-medium text-gray-600'>
              {dashboardData.enrolledStudentsData?.length||0}
            </p>
            <p className='text-gray-500'>Total Enrollment</p>
          </div>
        </div>

        <div className='flex items-center gap-3 border p-4 w-56 rounded-md'>
          <img src={assets.appointments_icon} alt='' />
          <div>
            <p className='text-2xl font-medium text-gray-600'>
              {dashboardData.totalCourses}
            </p>
            <p className='text-gray-500'>Total Courses</p>
          </div>
        </div>

        <div className='flex items-center gap-3 border p-4 w-56 rounded-md'>
          <img src={assets.earning_icon} alt='' />
          <div>
            <p className='text-2xl font-medium text-gray-600'>
              {currency}{dashboardData.totalEarnings}
            </p>
            <p className='text-gray-500'>Total Earnings</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
