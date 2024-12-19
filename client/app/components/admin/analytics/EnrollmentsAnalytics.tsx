import React, { FC, useEffect } from 'react';
import { styles } from '../../../utils/style';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loading from '../../../../components/common/Loading';
import { useGetEnreollmentsAnalyticsQuery } from '../../../../redux/features/analytics/analyticsApi';
interface EnrollmentsAnalyticsProps {
  isDashboard: boolean;
}

const EnrollmentsAnalytics: FC<EnrollmentsAnalyticsProps> = (props) => {
  const { isDashboard } = props;
  const { isLoading, data } = useGetEnreollmentsAnalyticsQuery({}, { refetchOnMountOrArgChange: true });
  const analyticsData: any = [];
  if (data) {
    data.enrollments?.last12Months?.forEach((item: any) => {
      analyticsData.push({
        name: item.month,
        count: item.count
      });
    });
  }
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={isDashboard ? 'h-30vh' : 'h-screen'}>
          <div className={isDashboard ? 'mb-2 mt-[0px] pl-[40px]' : 'ml-14 mt-20'}>
            <h1 className={`${styles.title} px-5 !text-start ${isDashboard && '!text-[20px]'}`}>
              {isDashboard ? 'Khóa học đã bán' : 'Phân tích dữ liệu số khóa học đã bán'}
            </h1>
            {!isDashboard && <p className={`${styles.label} px-5`}>Dữ liệu được thống kê 12 tháng gần nhất</p>}
          </div>
          <div className={`w-full ${isDashboard ? 'h-[30vh]' : 'h-screen'} flex items-center justify-center`}>
            <ResponsiveContainer width={isDashboard ? '85%' : '90%'} height={isDashboard ? '100%' : '50%'}>
              <LineChart
                width={500}
                height={300}
                data={analyticsData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {!isDashboard && <Legend />}
                <Line type="monotone" dataKey="count" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default EnrollmentsAnalytics;
