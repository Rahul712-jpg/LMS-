import React from 'react';
import { Routes, Route, useMatch } from 'react-router-dom';
import Navbar from './components/student/Navbar.jsx';

import Home from './pages/student/Home';
import CourseList from './pages/student/CourseList';
import CourseDetail from './pages/student/CourseDetail';
import MyEnrollment from './pages/student/MyEnrollments';
import Player from './pages/student/Player';
import Loading from './components/student/Loading';

import Educator from './pages/Educator/Educator';
import Dashboard from './pages/Educator/Dashboard';
import AddCourses from './pages/Educator/AddCourses';
import MyCourses from './pages/Educator/MyCourses';
import StudentEnrolled from './pages/Educator/StudentEnrolled';

import "quill/dist/quill.snow.css";
import { ToastContainer ,toast} from 'react-toastify';
import { useEffect } from 'react';


const App = () => {
  const isEducatorRoute = useMatch('/educator/*');


   

  return (
    <div className='text-default min-h-screen bg-white'>
      <ToastContainer/>
      {!isEducatorRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/course-list' element={<CourseList />} />
        <Route path='/course-list/:input' element={<CourseList />} />
        <Route path='/course/:courseId' element={<CourseDetail />} />
        <Route path='/my-enrollment' element={<MyEnrollment />} />
        <Route path='/player/:courseId' element={<Player />} />
        <Route path='/loading/:path' element={<Loading />} />

        <Route path='/educator' element={<Educator />}>
          <Route index element={<Dashboard />} />
          <Route path='add-courses' element={<AddCourses />} />
          <Route path='my-courses' element={<MyCourses />} />
          <Route path='student-enrolled' element={<StudentEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
