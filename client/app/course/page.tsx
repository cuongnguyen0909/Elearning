'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react';
import { useGetAllCoursesByUserQuery } from '../../redux/features/course/courseApi';
import { useGetAllCategoriesQuery } from '../../redux/features/category/categoryApi';
import Loading from '../../components/common/Loading';
import Header from '../components/header/Header';
import Heading from '../../components/public/Heading';
import { styles } from '../utils/style';
import CourseCard from '../components/home/CourseCard';

interface PageProps {}

const page: FC<PageProps> = (props) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get('keyword');
  const { data: coursesData, isLoading } = useGetAllCoursesByUserQuery(undefined, {});
  const { data: categoriesData, isLoading: loading } = useGetAllCategoriesQuery(undefined, {});
  const [route, setRoute] = useState('Login');
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState('Tất cả');
  const router = useRouter();

  const categories = categoriesData?.categories;

  useEffect(() => {
    if (category === 'Tất cả' && !search) {
      setCourses(coursesData?.courses);
    } else if (category !== 'Tất cả') {
      setCourses(coursesData?.courses.filter((course: any) => course.category?.title === category));
    } else if (search) {
      setCourses(
        coursesData?.courses.filter((course: any) => course.title.toLowerCase().includes(search.toLowerCase()))
      );
      setCategory('Tất cả');
    }
  }, [coursesData, category, search]);

  const handleCategoryClick = (selectedCategory: string) => {
    setCategory(selectedCategory); // Cập nhật category
    router.replace('/course'); // Reset URL
  };

  return (
    <div>
      {isLoading || loading ? (
        <Loading />
      ) : (
        <>
          <div className={`min-h-screen dark:bg-gray-900`}>
            <Heading
              title={`Courses`}
              description="ELearning is a platform for learning."
              keywords="ELearning,Programming,MERN,Redux,Science"
            />
            <Header open={open} setOpen={setOpen} activeItem={1} setRoute={setRoute} route={route} />
            <div className="flex w-full flex-wrap items-center">
              <div
                className={`h-[35px] ${category === 'Tất cả' ? 'bg-[crimson]' : 'bg-[#5050cb]'} m-3 flex cursor-pointer items-center justify-center rounded-[30px] px-3 font-Arimo`}
                onClick={() => handleCategoryClick('Tất cả')}
              >
                Tất cả
              </div>
              {categories?.map((item: any, index: number) => (
                <div
                  key={index}
                  className={`h-[35px] ${category === item.title ? 'bg-[crimson]' : 'bg-[#5050cb]'} m-3 flex cursor-pointer items-center justify-center rounded-[30px] px-3 font-Arimo`}
                  onClick={() => handleCategoryClick(item.title)}
                >
                  {item.title}
                </div>
              ))}
            </div>
            {courses && courses?.length > 0 && (
              <h4 className="px-12 pt-12 text-2xl font-bold text-gray-500">Tìm thấy {courses.length} khóa học</h4>
            )}
            <div className="mid:grid-cols-2 mid:gap-[25px] md-12 grid grid-cols-1 gap-[20px] border-0 px-10 py-10 lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[15px]">
              {courses &&
                courses?.length > 0 &&
                courses.map((course: any, index: number) => (
                  <div>
                    <CourseCard key={index} course={course} isSearch={true} />
                  </div>
                ))}
            </div>
            {courses && courses?.length === 0 && (
              <div className="flex h-[50vh] items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-500">
                  Không tìm thấy khóa học nào phù hợp với yêu cầu của bạn
                </h1>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default page;
