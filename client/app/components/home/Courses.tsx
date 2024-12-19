import React, { FC, useEffect, useState } from 'react';
import { useGetAllCoursesByUserQuery } from '../../../redux/features/course/courseApi';
import CourseCard from './CourseCard';

interface CoursesProps {}

const Courses: FC<CoursesProps> = (props) => {
  const { data, isLoading, refetch } = useGetAllCoursesByUserQuery(
    {},
    {
      refetchOnMountOrArgChange: true
    }
  );
  const [courses, setCourses] = useState<any[]>([]);
  useEffect(() => {
    setCourses(data?.courses || []);
  }, [data]);
  return (
    <div className="border-b pb-20 pl-28 pt-10 text-center font-Arimo text-[25px] font-[700] leading-[35px] tracking-tight text-[#000] dark:text-white sm:text-3xl 800px:!leading-[60px] lg:text-4xl">
      <h1 className="pb-10">
        Mở rộng cơ hội tìm kiếm việc làm <br />
        <strong>
          <span>đến từ việc học các khóa học online</span>
        </strong>
      </h1>
      <div className="mid:grid-cols-2 mid:gap-[25px] md-12 grid grid-cols-1 gap-[20px] border-0 lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[15px]">
        {courses &&
          courses?.map(
            (course: any, index: number) => !course?.isDeleted && <CourseCard key={index} course={course} />
          )}
      </div>
    </div>
  );
};

export default Courses;
