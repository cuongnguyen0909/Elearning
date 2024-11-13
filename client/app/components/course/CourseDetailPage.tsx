'use client';

import React, { FC, useEffect, useState } from 'react';
import { useGetCoursesByIdQuery } from '../../../redux/features/course/courseApi';
import Loading from '../../../components/common/Loading';
import Heading from '../../../components/public/Heading';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import CourseDetail from './CourseDetail';
import {
  useCreateEnrollmentMutation,
  useCreatePaymentMutation,
  useGetStripePublishableKeyQuery
} from '../../../redux/features/enrollment/enrollmentApi';
import { loadStripe } from '@stripe/stripe-js';
interface CourseDetailPageProps {
  id: string;
}

const CourseDetailPage: FC<CourseDetailPageProps> = (props) => {
  const { id } = props;
  const [route, setRoute] = useState<string>('Login');
  const [open, setOpen] = useState<boolean>(false);
  const { data: courseData, isLoading: isLoadingCourseData, error: errorCourseData } = useGetCoursesByIdQuery(id);
  const {
    data: stripePublishableKey,
    isLoading: isLoadingStripePublishableKey,
    error: errorStripePublishableKey
  } = useGetStripePublishableKeyQuery({});

  const [createPayment, { data: dataCreatePayment, error: errorCreatePayment, isLoading: isLoadingCreatePayment }] =
    useCreatePaymentMutation();
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    if (stripePublishableKey) {
      const publishableKey = stripePublishableKey.publishablekey;
      setStripePromise(loadStripe(publishableKey));
    }
    if (courseData) {
      const amount = Math.round(courseData?.course?.price * 100);
      createPayment(amount);
    }
  }, [stripePublishableKey, courseData]);

  useEffect(() => {
    if (dataCreatePayment) {
      setClientSecret(dataCreatePayment?.client_secret);
    }
  }, [dataCreatePayment]);
  return (
    <>
      {isLoadingCourseData ? (
        <Loading />
      ) : (
        <div>
          <Heading
            title={courseData?.course?.title + '-Edemy'}
            description={
              'Edemy là nơi học tập trực tuyến hàng đầu Việt Nam. Học tập trực tuyến mọi lúc, mọi nơi, mọi thiết bị. Đăng ký ngay hôm nay!'
            }
            keywords={courseData?.course?.tags}
          />
          <Header route={route} setRoute={setRoute} open={open} setOpen={setOpen} activeItem={1} />
          {stripePromise && (
            <CourseDetail data={courseData} stripePromise={stripePromise} clientSecret={clientSecret} />
          )}
          <Footer route={route} open={open} setRoute={setRoute} setOpen={setOpen} />
        </div>
      )}
    </>
  );
};

export default CourseDetailPage;
