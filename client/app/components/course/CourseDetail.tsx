import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Rating from '../../../components/rating/Rating';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import CoursePlayer from '../admin/course/components/CoursePlayer';
import Link from 'next/link';
import { styles } from '../../utils/style';
import CourseContentList from './CourseContentList';
interface CourseDetailProps {
    data: any;
}

const CourseDetail: FC<CourseDetailProps> = (props) => {
    const { data } = props;
    const [courseData, setCourseData] = useState<any>(null);
    const { user } = useSelector((state: any) => state.auth);
    const discountPercentage = ((courseData?.estimatedPrice - courseData?.price) / courseData?.estimatedPrice) * 100;
    const discountPercentagePrice = discountPercentage.toFixed(0);

    const isPurchased = user && user?.courses?.find((course: any) => course._id === data?._id);

    const handleOrder = () => {
        console.log('Order');
    };

    useEffect(() => {
        if (data) {
            setCourseData(data?.course);
        }
    }, [data]);

    return (
        <div>
            <div className="m-auto min-h-screen w-[90%] py-5 pb-20 800px:w-[90%]">
                <div className="flex w-full flex-col-reverse 800px:flex-row">
                    <div className="w-full pr-4 800px:w-[65%] 800px:pr-[5]">
                        <h1 className="font-Poppins text-[26px] font-[600] text-black dark:text-white">
                            {courseData?.title}
                        </h1>
                        <div className="flex items-center justify-between pt-3">
                            <div className="flex break-inside-avoid-column items-center gap-6">
                                <Rating rating={courseData?.rating} />
                                <h5 className="text-black dark:text-white">{courseData?.reviews?.length} Đánh giá</h5>
                                <h5 className="text-black dark:text-white">{courseData?.purchased} Học viên</h5>
                            </div>
                        </div>
                        <br />
                        <h2 className="font-Poppins text-[22px] font-[600] text-black dark:text-white">
                            Bạn sẽ học được gì từ khóa học này?
                        </h2>
                        <div>
                            {courseData?.benefits?.map((item: any, index: number) => (
                                <div key={index} className="flex w-full py-2 800px:items-center">
                                    <div className="mr-1 w-[15px]">
                                        <IoCheckmarkDoneOutline size={20} className="text-black dark:text-white" />
                                    </div>
                                    <p className="pl-2 text-black dark:text-white">{item?.title}</p>
                                </div>
                            ))}
                            <br />
                            <br />
                        </div>
                        <h2 className="font-Poppins text-[22px] font-[600] text-black dark:text-white">
                            Một số yêu cầu trước khi tham gia
                        </h2>
                        <div>
                            {courseData?.prerequisites?.map((item: any, index: number) => (
                                <div key={index} className="flex w-full py-2 800px:items-center">
                                    <div className="mr-1 w-[15px]">
                                        <IoCheckmarkDoneOutline size={20} className="text-black dark:text-white" />
                                    </div>
                                    <p className="pl-2 text-black dark:text-white">{item?.title}</p>
                                </div>
                            ))}
                            <br />
                            <br />
                            <div>
                                <h2 className="font-Poppins text-[22px] font-[600] text-black dark:text-white">
                                    Tổng quan khóa học
                                </h2>
                                <CourseContentList data={courseData} isDemo={true} />
                            </div>
                            <br />
                            <br />
                            <div className="w-full">
                                <h1 className="font-Poppins text-[20px] font-[600] text-black dark:text-white">
                                    Mô tả khóa học
                                </h1>
                                <p className="mt-[20px] overflow-hidden whitespace-pre-line text-[18px] text-black dark:text-white">
                                    {courseData?.description}
                                </p>
                            </div>
                            <br />
                            <br />
                            <div className="w-full">
                                <div className="items-center 800px:flex">
                                    <Rating rating={courseData?.rating} />
                                    <div className="mb-2 800px:mb-[unset]" />
                                    <h5 className="font-Poppins text-[22px] text-black dark:text-white">
                                        {Number.isInteger(courseData?.rating)
                                            ? courseData?.rating.toFixed(1)
                                            : courseData?.rating.toFixed(2)}
                                        {'  '}
                                        Đánh giá từ {courseData?.reviews?.length} học viên
                                    </h5>
                                </div>
                                <br />
                                {(courseData?.reviews && [...courseData?.reviews].reverse())?.map(
                                    (review: any, index: number) => (
                                        <div key={index} className="w-full pb-4">
                                            <div className="flex">
                                                <div className="h-[50px] w-[50px]">
                                                    <div className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-[50px] bg-slate-600">
                                                        <h1 className="text-[18px] uppercase text-black dark:text-white">
                                                            {review?.user?.name?.slice(0, 2)}
                                                        </h1>
                                                    </div>
                                                </div>
                                                <div className="hidden pl-2 800px:block">
                                                    <div className="flex items-center">
                                                        <h5 className="pr-2 text-[18px] text-black dark:text-white">
                                                            {review?.user?.name}
                                                        </h5>
                                                        <Rating rating={review?.rating} />
                                                    </div>
                                                    <p className="text-black dark:text-white">{review?.review}</p>
                                                    <small className="text-[000000d1] dark:text-[#ffffff83]">
                                                        {new Date(review?.createdAt).toLocaleDateString()}
                                                    </small>
                                                </div>
                                                <div className="800px:hiiden flex items-center pl-2">
                                                    <h5 className="pr-2 text-[18px] text-black dark:text-white">
                                                        {review?.user?.name}
                                                    </h5>
                                                    <Rating rating={review?.rating} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="relative w-full 800px:w-[35%]">
                        <div className="sticky left-0 top-[100px] z-50 w-full">
                            <CoursePlayer videoUrl={courseData?.demoUrl} title={courseData?.title} />
                            <div className="flex items-center">
                                <h2 className="pt-5 text-[22px] text-black dark:text-white">
                                    {courseData?.price === 0 ? 'Miễn phí' : `${courseData?.price}$`}
                                </h2>
                                <h5 className="mt-2 pl-3 text-[18px] text-black line-through opacity-80 dark:text-white">
                                    {courseData?.estimatedPrice}$
                                </h5>
                                <h4 className="pl-5 pt-4 text-[18px] text-black dark:text-white">
                                    Giảm {discountPercentagePrice}%
                                </h4>
                            </div>
                            <div className="flex items-center">
                                {isPurchased ? (
                                    <Link
                                        className={`${styles.button} my-3 !w-[180px] cursor-pointer !bg-[crimson] font-Poppins`}
                                        href={`/course-access/${courseData?._id}`}
                                    >
                                        Học ngay
                                    </Link>
                                ) : (
                                    <div
                                        className={`${styles.button} my-3 !w-[180px] cursor-pointer !bg-[crimson] font-Poppins`}
                                        onClick={handleOrder}
                                    >
                                        Mua ngay {courseData?.price}$
                                    </div>
                                )}
                            </div>
                            <br />
                            <p className="pb-1 text-black dark:text-white">
                                • <strong>30 ngày hoàn tiền - Đảm bảo hài lòng 100%</strong>
                            </p>
                            <p className="pb-1 text-black dark:text-white">
                                • <strong>Source code đầy đủ</strong>
                            </p>
                            <p className="pb-1 text-black dark:text-white">
                                • <strong>Mua một lần - Học mãi mãi</strong>
                            </p>
                            <p className="pb-3 800px:pb-1">
                                • <strong>Học theo lịch của bạn - học bất cứ khi nào, ở bất cứ đâu</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;