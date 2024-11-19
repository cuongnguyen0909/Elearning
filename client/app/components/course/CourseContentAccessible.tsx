import { FC, useEffect, useState } from 'react';
import Loading from '../../../components/common/Loading';
import Heading from '../../../components/public/Heading';
import { useGetCourseContentAccessibleQuery } from '../../../redux/features/course/courseApi';
import Header from '../header/Header';
import CourseContentList from './CourseContentList';
import CourseContentMedia from './CourseContentMedia';
import { useMarkCompleteVideoMutation } from '../../../redux/features/profile/profileApi';
import next from 'next';
import { useLoadUserQuery } from '../../../redux/features/api/apiSlice';

interface CourseContentAccessibleProps {
  id: any;
  user: any;
}

const CourseContentAccessible: FC<CourseContentAccessibleProps> = (props) => {
  const { id, user } = props;
  const { data, isSuccess, isLoading, error, refetch } = useGetCourseContentAccessibleQuery(id, {
    refetchOnMountOrArgChange: true
  });
  const { data: userData, refetch: refetchUserData } = useLoadUserQuery(
    {},
    {
      refetchOnMountOrArgChange: true
    }
  );
  const [route, setRoute] = useState<string>('Login');
  const [open, setOpen] = useState<boolean>(false);
  const [activeVideo, setActiveVideo] = useState<number>(0);
  const courseContent = data?.course?.contents;

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Header route={route} setRoute={setRoute} open={open} setOpen={setOpen} activeItem={1} />
          <div className="grid w-full 800px:grid-cols-10">
            <Heading
              title={courseContent?.[activeVideo]?.title}
              description={
                'Edemy là nơi học tập trực tuyến hàng đầu Việt Nam. Học tập trực tuyến mọi lúc, mọi nơi, mọi thiết bị. Đăng ký ngay hôm nay!'
              }
              keywords={'Edemy, Học tập trực tuyến, Học tập online'}
            />
            <div className="col-span-7">
              <CourseContentMedia
                data={courseContent}
                id={id}
                activeVideo={activeVideo}
                setActiveVideo={setActiveVideo}
                user={user}
                refetch={refetch}
                refetchUserData={refetchUserData}
              />
            </div>
            <div className="col-span-3 800px:col-span-3 800px:block">
              <CourseContentList
                data={data?.course}
                setActiveVideo={setActiveVideo}
                activeVideo={activeVideo}
                refetchUserData={refetchUserData}
                userData={userData}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CourseContentAccessible;
