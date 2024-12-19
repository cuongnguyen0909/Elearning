import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Rating from '../../../components/rating/Rating';
import { IoCheckmarkDoneOutline, IoCloseOutline } from 'react-icons/io5';
import CoursePlayer from '../admin/course/components/CoursePlayer';
import Link from 'next/link';
import { styles } from '../../utils/style';
import CourseContentList from './CourseContentList';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../checkout/CheckoutForm';
import { useLoadUserQuery } from '../../../redux/features/api/apiSlice';
import CustomModal from '../../../components/modal/CustomModal';
import Login from '../auth/Login';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/formatHelper';
import { useRouter } from 'next/navigation';
import Loading from '../../../components/common/Loading';
interface CourseDetailProps {
  data: any;
  stripePromise: any;
  clientSecret: string;
}

const CourseDetail: FC<CourseDetailProps> = (props) => {
  const { data: userData } = useLoadUserQuery(
    {},
    {
      refetchOnMountOrArgChange: true
    }
  );
  const router = useRouter();
  const { data, stripePromise, clientSecret } = props;
  const [courseData, setCourseData] = useState<any>(null);
  const [openPayment, setOpenPayment] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [route, setRoute] = useState<string>('Login');
  const discountPercentage = ((courseData?.estimatedPrice - courseData?.price) / courseData?.estimatedPrice) * 100;
  const discountPercentagePrice = discountPercentage.toFixed(0);
  const { isLoggedIn, user } = useSelector((state: any) => state.auth);

  const handleOrder = () => {
    if (!isLoggedIn || !user) {
      setOpenLogin(true);
      //display toast waring login to order
      toast.error('Vui lòng đăng nhập để mua khóa học', {
        duration: 2000
      });
      return;
    }
    setOpenPayment(true);
  };

  useEffect(() => {
    if (data) {
      setCourseData(data?.course);
    }
  }, [data]);
  const isPurchased = userData?.user?.courses?.find((course: any) => course?._id === courseData?._id);
  const handleRedirect = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(`/course/access/${courseData?._id}`);
  };
  return (
    <div>
      {isLoading && <Loading />}
      <div className="m-auto min-h-screen w-[90%] py-6 800px:w-[90%]">
        <div className="flex w-full flex-col-reverse 800px:flex-row">
          <div className="w-full px-4 800px:w-[65%] 800px:pr-[5]">
            <div className="w-full">
              <h1 className="px-4 font-Arimo text-[26px] font-bold text-black dark:text-white">{courseData?.title}</h1>
              <div className="flex items-center justify-between gap-4 py-4">
                <div className="flex break-inside-avoid-column flex-col justify-start px-4">
                  <p className="overflow-hidden whitespace-pre-line text-[18px] text-black dark:text-white">
                    {courseData?.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <h6 className={`!text-[16px] text-[#b19b38] dark:text-white`}>
                      {Number(courseData?.rating).toFixed(1)}
                    </h6>
                    <div className="mt-[2px]">
                      <Rating rating={courseData?.rating} />
                    </div>
                    <a href="#reviews" className="text-black underline dark:text-white">
                      {courseData?.reviews?.length} Đánh giá
                    </a>
                    <h5 className="text-black dark:text-white">{courseData?.purchased} Học viên</h5>
                  </div>
                  <div>
                    <h5 className="text-black dark:text-white">
                      Lần cập nhật gần nhất từ ngày: {formatDate(courseData?.updatedAt)}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-6 w-full"></div>
            <div className="border-t border-[#ccc] pt-4">
              <h2 className="px-4 font-Arimo text-[22px] font-bold text-black dark:text-white">Tổng quan khóa học</h2>
              <CourseContentList data={courseData} isDemo={true} />
            </div>
            <div className="h-6 w-full"></div>
            <div className="border-t border-[#ccc] pt-4">
              <h1 className="px-4 font-Arimo text-[20px] font-bold text-black dark:text-white">Mô tả khóa học</h1>
              <p className="overflow-hidden whitespace-pre-line px-4 py-2 text-[18px] text-black dark:text-white">
                {courseData?.description}
              </p>
            </div>
            <div className="h-6 w-full"></div>
            <div className="border-t border-[#ccc] pt-4">
              <h2 className="px-4 font-Arimo text-[22px] font-bold text-black dark:text-white">
                Bạn sẽ học được gì từ khóa học này?
              </h2>
              {courseData?.benefits?.map((item: any, index: number) => (
                <div key={index} className="flex w-full px-4 py-2 800px:items-center">
                  <div className="w-[15px mr-1">
                    <IoCheckmarkDoneOutline size={20} className="text-black dark:text-white" />
                  </div>
                  <p className="pl-2 text-black dark:text-white">{item?.title}</p>
                </div>
              ))}
            </div>
            <div className="h-6 w-full"></div>
            <div className="border-t border-[#ccc] pt-4">
              <h2 className="px-4 font-Arimo text-[22px] font-bold text-black dark:text-white">
                Một số yêu cầu trước khi tham gia
              </h2>
              {courseData?.prerequisites?.map((item: any, index: number) => (
                <div key={index} className="flex w-full px-4 py-2 800px:items-center">
                  <div className="mr-1 w-[15px]">
                    <IoCheckmarkDoneOutline size={20} className="text-black dark:text-white" />
                  </div>
                  <p className="pl-2 text-black dark:text-white">{item?.title}</p>
                </div>
              ))}
              <div className="h-6 w-full"></div>
              <div className="border-t border-[#ccc] pt-4">
                <div className="flex items-center">
                  <h2 className="px-4 font-Arimo text-[22px] font-bold text-black dark:text-white">
                    Đánh giá từ học viên
                  </h2>
                  <h4 className="text-black dark:text-white">
                    <i>({courseData?.reviews?.length} đánh giá)</i>
                  </h4>
                </div>
                <div className="items-center justify-center gap-4 800px:flex">
                  <h2 className="px-4 font-Arimo text-[22px] font-semibold text-black dark:text-white">
                    {Number.isInteger(courseData?.rating)
                      ? courseData?.rating.toFixed(1)
                      : courseData?.rating.toFixed(1)}
                    / 5
                  </h2>
                  <div className="mt-1">
                    <Rating isDemo rating={courseData?.rating} />
                  </div>
                </div>
                <div className="h-6 w-full"></div>
                {(courseData?.reviews && [...courseData?.reviews].reverse())?.map((review: any, index: number) => (
                  <div key={index} className="w-full px-4 pb-4" id="reviews">
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
                          <h5 className="pr-2 text-[18px] text-black dark:text-white">{review?.user?.name}</h5>
                          <Rating rating={review?.rating} />
                        </div>
                        <p className="text-black dark:text-white">{review?.review}</p>
                        <small className="text-[000000d1] text-black dark:text-[#ffffff83]">
                          {new Date(review?.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <div className="flex items-center pl-2 800px:hidden">
                        <h5 className="pr-2 text-[18px] text-black dark:text-white">{review?.user?.name}</h5>
                        <Rating rating={review?.rating} />
                      </div>
                    </div>
                  </div>
                ))}
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
                <h4 className="pl-5 pt-4 text-[18px] text-black dark:text-white">Giảm {discountPercentagePrice}%</h4>
              </div>
              <div className="flex items-center">
                {isPurchased ? (
                  <Link
                    className={`${styles.button} my-3 !w-[180px] cursor-pointer !bg-[crimson] font-Arimo`}
                    href={`/course/access/${courseData?._id}`}
                    onClick={(e) => handleRedirect(e)}
                  >
                    Học ngay
                  </Link>
                ) : (
                  <div
                    className={`${styles.button} my-3 !w-[180px] cursor-pointer !bg-[crimson] font-Arimo`}
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
      {openPayment && (
        <div className="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-[#00000036]">
          <div className="min-h-[500px] w-[500px] rounded-xl bg-white p-3 shadow">
            <div className="flex w-full justify-end">
              <IoCloseOutline size={40} className="cursor-pointer text-black" onClick={() => setOpenPayment(false)} />
            </div>
            {stripePromise && clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret
                }}
              >
                <CheckoutForm setOpen={setOpenPayment} data={courseData} user={user}/>
              </Elements>
            )}
          </div>
        </div>
      )}
      {route === 'Login' && (
        <>
          {openLogin && <CustomModal open={openLogin} setOpen={setOpenLogin} setRoute={setRoute} component={Login} />}
        </>
      )}
    </div>
  );
};

export default CourseDetail;
