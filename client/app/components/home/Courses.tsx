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
    console.log('courses', courses);
    return (
        <div className="pl-28 text-center font-Poppins text-[25px] font-[700] leading-[35px] tracking-tight text-[#000] dark:text-white sm:text-3xl 800px:!leading-[60px] lg:text-4xl">
            <h1>
                Mở rộng cơ hội tìm kiếm việc làm{' '}
                <span className="text-gradient">
                    <strong className="text-[#FFD700]">Cơ hội</strong>
                </span>
                <br />
                <span>đến từ việc học tập</span>
            </h1>
            <br />
            <br />
            <div className="mid:grid-cols-2 mid:gap-[25px] md-12 grid grid-cols-1 gap-[20px] border-0 lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px]">
                {courses && courses?.map((course: any, index: number) => <CourseCard key={index} course={course} />)}
            </div>
        </div>
    );
};

export default Courses;
