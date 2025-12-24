import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets, dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/student/Loading';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const { currency, calculateCourseDuration } = useContext(AppContext);

  useEffect(() => {
    setDashboardData(dummyDashboardData);
  }, []);

  if (!dashboardData) return <Loading />;

  return (
    <div className='min-h-screen flex flex-col gap-8 p-4 md:p-8'>
      {/* Stats */}
      <div className='flex flex-wrap gap-5'>
        <div className='flex items-center gap-3 border p-4 w-56 rounded-md'>
          <img src={assets.patients_icon} alt='' />
          <div>
            <p className='text-2xl font-medium text-gray-600'>
              {dashboardData.enrolledStudentsData.length}
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
              {currency}
              {dashboardData.totalEarnings}
            </p>
            <p className='text-gray-500'>Total Earnings</p>
          </div>
        </div>
      </div>

      {/* Latest Enrollments */}
      <div>
        <h2 className='pb-4 text-lg font-medium'>Latest Enrollments</h2>

        <div className='overflow-hidden rounded-md bg-white border'>
          <table className='w-full text-left'>
            <thead className='border-b text-sm text-gray-700'>
              <tr>
                <th className='px-4 py-3'>Student</th>
                <th className='px-4 py-3'>Course</th>
                <th className='px-4 py-3'>Duration</th>
                <th className='px-4 py-3'>Status</th>
              </tr>
            </thead>

            <tbody className='text-sm text-gray-500'>
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr key={index} className='border-b'>
                  <td className='px-4 py-3 flex items-center gap-3'>
                    <img
                      src={item.student.imageUrl}
                      alt=''
                      className='w-9 h-9 rounded-full'
                    />
                    <span>{item.student.name}</span>
                  </td>

                  <td className='px-4 py-3'>
                    {item.course.courseTitle}
                  </td>

                  <td className='px-4 py-3'>
                    {calculateCourseDuration(item.course)}
                  </td>

                  <td className='px-4 py-3 text-green-600'>
                    Completed
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
