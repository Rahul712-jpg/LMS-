import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';

const MyCourses = () => {
  const { currency, allCourses } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    setCourses(allCourses);
  }, [allCourses]);

  return courses ? (
    <div className='h-screen flex flex-col items-start md:p-8 p-4'>
      <div className='w-full'>
        <h2 className='pb-4 text-lg font-medium'>My Courses</h2>

        <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
          <table className='w-full'>
            <thead className='border-b text-sm text-gray-700'>
              <tr>
                <th className='px-4 py-3'>All Courses</th>
                <th className='px-4 py-3'>Earnings</th>
                <th className='px-4 py-3'>Students</th>
                <th className='px-4 py-3'>Published on</th>
              </tr>
            </thead>

            <tbody className='text-sm text-gray-500'>
              {courses.map(course => (
                <tr key={course._id} className='border-b'>
                  <td className='px-4 py-3 flex items-center gap-3'>
                    <img
                      src={course.courseThumbnail}
                      alt='Course'
                      className='w-16'
                    />
                    <span className='hidden md:block truncate'>
                      {course.courseTitle}
                    </span>
                  </td>

                  <td className='px-4 py-3'>
                    {currency}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice -
                          (course.discount * course.coursePrice) / 100)
                    )}
                  </td>

                  <td className='px-4 py-3'>
                    {course.enrolledStudents.length}
                  </td>

                  <td className='px-4 py-3'>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
