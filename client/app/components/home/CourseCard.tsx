import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useState } from 'react';
import Rating from '../../../components/rating/Rating';
import { AiOutlineUnorderedList, AiOutlineUser } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import Loading from '../../../components/common/Loading';
interface CourseCardProps {
  course: any;
  isProfile?: boolean;
  isSearch?: boolean;
}

const CourseCard: FC<CourseCardProps> = (props) => {
  const { course, isProfile, isSearch } = props;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleRedirect = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(`/course/${course?._id}`);
  };
  return (
    <>
      {isLoading && <Loading />}
      <Link
        href={!isProfile ? `/course/${course?._id}` : `profile/course/${course.id}`}
        onClick={(e) => handleRedirect(e)}
      >
        <div
          className={`min-h-[25vh] w-[95%] rounded-lg border border-[#00000033] bg-[#f7f9fa] shadow-sm backdrop-blur hover:bg-[#f7f9fa2a] dark:border-[#ffffff1d] dark:bg-slate-500 dark:bg-opacity-20 dark:shadow-inner dark:shadow-[bg-slate-700]`}
        >
          <div className="h-[20vh]">
            <Image
              src={course?.thumbnail?.url ? course?.thumbnail?.url : require('../../../public/assets/banner.jpeg')}
              alt="banner"
              width={500}
              height={300}
              className="w-full rounded object-cover"
            />
          </div>
          <div className={`${isSearch && 'pt-16 text-center'} pt-12`}>
            <h1 className="font-Arimo text-[16px] font-[500] leading-[24px] tracking-tight text-black dark:text-white">
              {course?.title}
            </h1>
          </div>
          <div className={`flex w-full items-center justify-between px-4 ${isSearch && 'py-4'}`}>
            <div className="flex items-center justify-start gap-2">
              <h6 className={`text-[#b19b38] dark:text-white ${isProfile && 'hidden 800px:inline'} !text-[16px]`}>
                {Number(course?.rating).toFixed(1)}
              </h6>
              <Rating rating={course?.rating} />
            </div>
            <div className={`flex items-center justify-end gap-2 ${isSearch && ''}`}>
              <AiOutlineUser
                size={20}
                className={`text-black dark:text-white ${isProfile && 'hidden 800px:inline'} !text-[16px]`}
              />
              <h6 className={`text-black dark:text-white ${isProfile && 'hidden 800px:inline'} !text-[16px]`}>
                {course?.purchased} học viên
              </h6>
            </div>
          </div>
          <div className="flex w-full items-center justify-between px-4">
            <div className="mb-4 flex">
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
    </>
  );
};

export default CourseCard;
