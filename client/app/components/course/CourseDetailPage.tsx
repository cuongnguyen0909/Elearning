'use client';

import React, { FC, useState } from 'react';
import { useGetCoursesByIdQuery } from '../../../redux/features/course/courseApi';
import Loading from '../../../components/common/Loading';
import Heading from '../../../components/public/Heading';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import CourseDetail from './CourseDetail';

interface CourseDetailPageProps {
    id: string;
}

const CourseDetailPage: FC<CourseDetailPageProps> = (props) => {
    const { id } = props;
    const [route, setRoute] = useState<string>('Login');
    const [open, setOpen] = useState<boolean>(false);
    const { data, isLoading } = useGetCoursesByIdQuery(id);
    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <div>
                    <Heading
                        title={data?.course?.title + '-Edemy'}
                        description={
                            'Edemy là nơi học tập trực tuyến hàng đầu Việt Nam. Học tập trực tuyến mọi lúc, mọi nơi, mọi thiết bị. Đăng ký ngay hôm nay!'
                        }
                        keywords={data?.course?.tags}
                    />
                    <Header route={route} setRoute={setRoute} open={open} setOpen={setOpen} activeItem={1} />
                    <CourseDetail data={data} />
                    <Footer route={route} open={open} setRoute={setRoute} setOpen={setOpen} />
                </div>
            )}
        </>
    );
};

export default CourseDetailPage;
