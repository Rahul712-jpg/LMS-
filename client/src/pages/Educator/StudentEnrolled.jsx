import React, { useEffect, useState, useContext } from 'react';
import { dummyStudentEnrolled } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';

const StudentEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const { calculateCourseDuration } = useContext(AppContext);

  useEffect(() => {
    setEnrolledStudents(dummyStudentEnrolled);
  }, []);

  return enrolledStudents ? (
    <div className='min-h-screen flex flex-col items-start p-4 md:p-8'>
      <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
        <table className='w-full text-left text-sm'>
          <thead className='border-b text-gray-700'>
            <tr>
              <th className='px-4 py-3 hidden sm:table-cell'>#</th>
              <th className='px-4 py-3'>Student Name</th>
              <th className='px-4 py-3'>Course Title</th>
              <th className='px-4 py-3 hidden sm:table-cell'>Date</th>
            </tr>
          </thead>

          <tbody className='text-gray-500'>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className='border-b'>
                <td className='px-4 py-3 hidden sm:table-cell'>
                  {index + 1}
                </td>

                <td className='px-4 py-3 flex items-center gap-3'>
                  <img
                    src={item.student.imageUrl}
                    alt='Profile'
                    className='w-9 h-9 rounded-full'
                  />
                  <span>{item.student.name}</span>
                </td>

                <td className='px-4 py-3'>
                  {item.course.courseTitle}
                </td>

                <td className='px-4 py-3 hidden sm:table-cell'>
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default StudentEnrolled;
