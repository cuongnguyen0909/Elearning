import React, { FC, useState } from 'react';
import { useLoadUserQuery } from '../../../redux/features/api/apiSlice';
import CourseCard from '../home/CourseCard';
import { useRouter } from 'next/navigation';

interface MyCoursesProps {}

const MyCourses: FC<MyCoursesProps> = (props) => {
  const {
    data: user,
    error: userError,
    isLoading: isUserLoading
  } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRedirect = (e: any, courseId: string) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(`/course/access/${courseId}`);
  };

  const myCourse = user?.user?.courses;
  return (
    <div>
      <div className="flex flex-wrap gap-8 px-6 pb-[400px]">
        {myCourse &&
          myCourse?.length > 0 &&
          myCourse.map((course: any, index: number) => (
            <div>
              <CourseCard key={index} course={course} isProfile={true} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyCourses;
