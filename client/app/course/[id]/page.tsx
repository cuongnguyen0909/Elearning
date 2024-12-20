'use client';
import React, { FC, useEffect, useState } from 'react';
import CourseDetailPage from '../../components/course/CourseDetailPage';
import { useTheme } from 'next-themes';
import Heading from '../../../components/public/Heading';
import { useSelector } from 'react-redux';

interface PageProps {
  params: any;
}

const page: FC<PageProps> = (props) => {
  const { params } = props;
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className={`min-h-screen dark:bg-gray-900`}>
      <Heading title="Course Detail" description="Course detail" keywords="Detail,Course,Edemy" />

      <CourseDetailPage id={params?.id} />
    </div>
  );
};

export default page;
