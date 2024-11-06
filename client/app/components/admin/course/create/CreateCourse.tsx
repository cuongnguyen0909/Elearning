'use client';
import React, { FC, useEffect, useState } from 'react';
import { useCreateCourseMutation } from '../../../../../redux/features/course/courseApi';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import Loading from '../../../../../components/common/Loading';
import CourseInfomation from './components/CourseInfomation';
import CourseData from './components/CourseData';
import CourseContent from './components/CourseContent';
import CoursePreview from './components/CoursePreview';
import CourseOption from './components/CourseOption';
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
   const [createCourse, { isLoading, isSuccess, error }] = useCreateCourseMutation();
   useEffect(() => {
      if (isSuccess) {
         toast.success('Course created successfully');
         redirect('/admin/courses');
      }
      if (error) {
         if ('data' in error) {
            const err = error as any;
            toast.error(err.data.message);
         }
      }
   }, [isSuccess, error]);
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

   const handleSubmit = async () => {
      //Format benefit array
      const formatedBenefits = benefits.map((benefit: any) => ({
         title: benefit.title
      }));
      //Format prerequisites array
      const formatedPrerequisites = prerequisites.map((prerequisite: any) => ({
         title: prerequisite.title
      }));

      //Format course content array
      const formatedCourseContent = courseContent.map((content: any) => ({
         title: content.title,
         videoUrl: content.videoUrl,
         description: content.description,
         videoSection: content.videoSection,
         links: content.links.map((link: any) => ({
            title: link.title,
            url: link.url
         })),
         suggestion: content.suggestion
      }));
      //prepare  object to send to server
      const data = {
         title: courseInfo.title,
         description: courseInfo.description,
         price: courseInfo.price,
         estimatedPrice: courseInfo.estimatedPrice,
         tags: courseInfo.tags,
         level: courseInfo.level,
         demoUrl: courseInfo.demoUrl,
         thumbnail: courseInfo.thumbnail,
         benefits: formatedBenefits,
         prerequisites: formatedPrerequisites,
         courseContent: formatedCourseContent
      };
      setCourseData(data);
   };

   const handleCourseCreate = async () => {
      const data = courseData;
      console.log(data);
      await createCourse(data);
   };
   return (
      <div className="flex min-h-screen w-full">
         {isLoading && <Loading />}
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
            {active === 3 && (
               <CoursePreview
                  active={active}
                  setActive={setActive}
                  courseData={courseData}
                  handleCourseCreate={handleCourseCreate}
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
