'use client';
import React, { FC, useState } from 'react';
import CourseInfomation from './CourseInfomation';
import CourseOption from './CourseOption';
import CourseData from './CourseData';
import CourseContent from './CourseContent';
interface CreateCourseProps {}

const CreateCourse: FC<CreateCourseProps> = (props) => {
   const [active, setActive] = useState(0);
   const [courseInfo, setCourseInfo] = useState({
      title: '',
      description: '',
      price: '',
      estimatedPrice: '',
      tags: '',
      level: '',
      demoUrl: '',
      thumbnail: ''
   });

   const [benefits, setBenefits] = useState([{ title: '' }]);
   const [prerequisites, setPrerequisites] = useState([{ title: '' }]);
   const [courseContent, setCourseContent] = useState([
      {
         title: '',
         videoUrl: '',
         description: '',
         videoSection: 'Untitled Section',
         links: [
            {
               title: '',
               url: ''
            }
         ],
         suggestion: ''
      }
   ]);

   const [courseData, setCourseData] = useState({});

   const handleSubmit = async () => {};
   return (
      <div className="flex min-h-screen w-full">
         <div className="w-[80%]">
            {active === 0 && (
               <CourseInfomation
                  courseInfo={courseInfo}
                  setCourseInfo={setCourseInfo}
                  active={active}
                  setActive={setActive}
               />
            )}
            {active === 1 && (
               <CourseData
                  benefits={benefits}
                  setBenefits={setBenefits}
                  prerequisites={prerequisites}
                  setPrequisites={setPrerequisites}
                  active={active}
                  setActive={setActive}
               />
            )}
            {active === 2 && (
               <CourseContent
                  active={active}
                  setActive={setActive}
                  courseContent={courseContent}
                  setCourseContent={setCourseContent}
                  handleSubmit={handleSubmit}
               />
            )}
         </div>
         <div className="top-18 fixed right-0 z-[1] mt-[100px] h-screen w-[20%]">
            <CourseOption active={active} setActive={setActive} />
         </div>
      </div>
   );
};

export default CreateCourse;
