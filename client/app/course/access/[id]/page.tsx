'use client';
import React, { FC, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Heading from '../../../../components/public/Heading';
import CourseDetailPage from '../../../components/course/CourseDetailPage';
import { useLoadUserQuery } from '../../../../redux/features/api/apiSlice';
import { redirect } from 'next/navigation';
import Loading from '../../../../components/common/Loading';
import CourseContentAccessible from '../../../components/course/CourseContentAccessible';

interface PageProps {
  params: any;
}

const page: FC<PageProps> = (props) => {
  const { params } = props;
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { isLoading, error, data } = useLoadUserQuery({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data) {
      const isPurchased = data?.user?.courses?.find((course: any) => course?._id === params?.id);
      if (!isPurchased) {
        redirect('/');
      }
      if (error) {
        redirect('/');
      }
    }
  }, [data, error]);
  return (
    // <div
    //   className={`min-h-screen ${
    //     theme === 'light' ? 'bg-gradient-to-l from-blue-100 to-blue-200' : 'dark:bg-gray-900'
    //   }`}
    // >
    //   <Heading title="Course Detail" description="Course detail" keywords="Detail,Course,Edemy" />

    //   {/* <CourseDetailPage id={params?.id} /> */}
    // </div>
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <CourseContentAccessible id={params?.id} user={data?.user} />
        </div>
      )}
    </>
  );
};

export default page;
