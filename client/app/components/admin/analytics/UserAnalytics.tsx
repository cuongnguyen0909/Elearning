import React, { FC } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, LabelList, Label, Tooltip } from 'recharts';
import Loading from '../../../../components/common/Loading';
import { useGetUsersAnalyticsQuery } from '../../../../redux/features/analytics/analyticsApi';
import { styles } from '../../../utils/style';

interface UserAnalyticsProps {
    isDashboard?: boolean;
}

const UserAnalytics: FC<UserAnalyticsProps> = (props) => {
    const { isDashboard } = props;
    const { data, isLoading } = useGetUsersAnalyticsQuery({}, { refetchOnMountOrArgChange: true });
    const analyticsData: any = [];
    if (data) {
        data?.users?.last12Months.forEach((item: any) => {
            analyticsData.push({ name: item.month, count: item.count });
        });
    }
    const minValue = 0;
    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <div className={`${!isDashboard ? 'mt-14' : 'mt-14 rounded-sm pb-5 shadow-sm dark:bg-[#111C43]'}`}>
                    <div className={`${isDashboard ? '!ml-8 mb-5' : ''}`}>
                        <h1 className={`${styles.title} ${isDashboard && '!text-[20px]'} px-5 !text-start`}>
                            {isDashboard ? 'Học viên' : 'Phân tích dữ liệu học viên'}
                        </h1>
                        {!isDashboard && (
                            <p className={`${styles.label} px-5`}>Dữ liệu được thống kê 12 tháng gần nhất </p>
                        )}
                    </div>
                    <div className={`w-full ${isDashboard ? 'h-[30vh]' : 'h-screen'} flex items-center justify-center`}>
                        <ResponsiveContainer
                            width={isDashboard ? '100%' : '90%'}
                            height={!isDashboard ? '50%' : '100%'}
                        >
                            <AreaChart
                                data={analyticsData}
                                margin={{
                                    top: 0,
                                    right: 30,
                                    left: 0,
                                    bottom: 0
                                }}
                            >
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="count" stroke="#4d62d9" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserAnalytics;
