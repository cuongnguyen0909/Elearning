import React, { FC, useEffect } from 'react';
import UserAnalytics from '../analytics/UserAnalytics';
import { BiBorderLeft } from 'react-icons/bi';
import { Box, CircularProgress } from '@mui/material';
import { PiUsersFourLight } from 'react-icons/pi';
import EnrollmentsAnalytics from '../analytics/EnrollmentsAnalytics';
import AllEnrollments from '../enrollment/AllEnrollments';
import {
  useGetCoursesAnalyticsQuery,
  useGetEnreollmentsAnalyticsQuery,
  useGetUsersAnalyticsQuery
} from '../../../../redux/features/analytics/analyticsApi';
import { useGetAllCoursesQuery } from '../../../../redux/features/course/courseApi';
import { useGetAllUsersQuery } from '../../../../redux/features/user/userApi';

interface DashboardWigetsProps {
  open?: boolean;
  value?: number;
}

const CircularProgressWithLabel: FC<DashboardWigetsProps> = (props) => {
  const { value, open } = props;
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex'
      }}
    >
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        color={value && value > 99 ? 'info' : 'error'}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      ></Box>
    </Box>
  );
};

const DashboardWigets: FC<DashboardWigetsProps> = (props) => {
  const { open, value } = props;
  const { data } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
  const { data: users } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });
  const [allCourseErolled, setAllCourseErolled] = React.useState<number>(0);
  const [usersCount, setUsersCount] = React.useState<number>(0);
  const numberOfEnrolled = data?.courses.reduce((acc: number, course: any) => {
    return acc + course.purchased;
  }, 0);
  useEffect(() => {
    setAllCourseErolled(numberOfEnrolled);
    setUsersCount(users?.users.length);
  }, [numberOfEnrolled]);
  return (
    <div className="mt-[30px] min-h-screen">
      <div className="grid grid-cols-[75%,25%]">
        <div className="pl-10 pt-5">
          <UserAnalytics isDashboard={true} />
        </div>
        <div className="ml-2 pr-4 pt-[75px]">
          <div className="w-full rounded-sm shadow dark:bg-[#111C43]">
            <div className="flex items-center justify-center gap-6 px-4 py-14">
              <BiBorderLeft className="text-[30px] text-[#000] dark:text-[#45CBA0]" />
              <h5 className="font-Arimo text-[20px] text-black dark:text-white">{allCourseErolled}</h5>
              <h5 className="font-Arimo text-[20px] font-[400] text-black dark:text-white">Lượt đăng ký</h5>
              {/* <div>
                <CircularProgressWithLabel value={100} open={open} />
                <h5 className="pt-4 text-center">+120%</h5>
              </div> */}
            </div>
          </div>
          <div className="shadown my-6 w-full rounded-sm dark:bg-[#111C43]">
            <div className="flex items-center justify-center gap-10 px-4 py-14">
              <PiUsersFourLight className="text-[30px] text-[#000] dark:text-[#45CBA0]" />
              <h5 className="font-Arimo text-[20px] text-black dark:text-[#fff]">{usersCount}</h5>
              <h5 className="font-Arimo text-[20px] font-[400] text-black dark:text-white">Học viên</h5>
              {/* <div>
                <CircularProgressWithLabel value={100} open={open} />
                <h5 className="pt-4 text-center">+150%</h5>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="shadown-sm m-auto ml-10 mr-4 mt-2 h-[40vh] dark:bg-[#111c43]">
        <EnrollmentsAnalytics isDashboard={true} />
      </div>
    </div>
  );
};

export default DashboardWigets;
