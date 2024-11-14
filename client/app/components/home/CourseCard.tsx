import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
import Rating from '../../../components/rating/Rating';
import { AiOutlineUnorderedList } from 'react-icons/ai';

interface CourseCardProps {
  course: any;
  isProfile?: boolean;
}

const CourseCard: FC<CourseCardProps> = (props) => {
  const { course, isProfile } = props;
  return (
    <Link href={!isProfile ? `/course/${course?._id}` : `profile/course/${course.id}`}>
      <div className="min-h-[25vh] w-full rounded-lg border border-[#00000015] p-3 shadow-sm backdrop-blur dark:border-[#ffffff1d] dark:bg-slate-500 dark:bg-opacity-20 dark:shadow-inner dark:shadow-[bg-slate-700]">
        <div className="h-[20vh]">
          <Image
            src={course?.thumbnail?.url ? course?.thumbnail?.url : require('../../../public/assets/banner.jpeg')}
            alt="banner"
            width={500}
            height={300}
            objectFit="contain"
            className="w-full rounded"
          />
        </div>
        <br />
        <h1 className="font-Arimo text-[16px] font-[500] leading-[24px] tracking-tight text-black dark:text-white">
          {course?.title}
        </h1>
        <div className="flex w-full items-center justify-between pt-2">
          <Rating rating={course?.rating} />
          <h6 className={`text-black dark:text-white ${isProfile && 'hidden 800px:inline'} !text-[16px]`}>
            {course?.purchased} học viên
          </h6>
        </div>
        <div className="flex w-full items-center justify-between pt-3">
          <div className="flex">
            <h3 className="text-[16px] text-black dark:text-white">
              {course?.price === 0 ? 'Miễn phí' : `${course?.price}$`}{' '}
            </h3>
            <h5 className="mt-[-5px] pl-3 text-[14px] text-black line-through opacity-80 dark:text-white">
              {course?.estimatedPrice}$
            </h5>
          </div>
          <div className="flex items-center pb-3">
            <AiOutlineUnorderedList size={20} className="text-black dark:text-white" />
            <h5 className="pl-2 text-[16px] text-black dark:text-white">{course?.contents?.length} bài học</h5>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
