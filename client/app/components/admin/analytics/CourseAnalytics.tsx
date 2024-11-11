import React, { FC } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, LabelList, Label } from 'recharts';

import Loading from '../../../../components/common/Loading';
import { useGetCoursesAnalyticsQuery } from '../../../../redux/features/analytics/analyticsApi';
import { styles } from '../../../utils/style';

interface CourseAnalyticsProps {}

const CourseAnalytics: FC<CourseAnalyticsProps> = (props) => {
    const { data, isLoading } = useGetCoursesAnalyticsQuery({}, { refetchOnMountOrArgChange: true });

    const analyticsData: any = [];
    if (data) {
        data?.courses?.last12Months.forEach((item: any) => {
            analyticsData.push({ name: item.month, counr: item.count });
        });
    }
    const minValue = 0;
    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="h-screen">
                    <div className="ml-14 mt-20">
                        <h1 className={`${styles.title} px-5 !text-start`}>Thống kê số khóa học trong hệ thống</h1>
                        <p className={`${styles.label} px-5`}>Dữ liệu được thống kê 12 tháng gần nhất</p>
                    </div>
                    <div className="flex h-[90%] w-full items-center justify-center">
                        <ResponsiveContainer width="90%" height="50%">
                            <BarChart width={150} height={300} data={analyticsData}>
                                <XAxis dataKey="name">
                                    <Label offset={0} position="insideBottom" />
                                </XAxis>
                                <YAxis domain={[minValue, 'auto']} />
                                <Bar dataKey="counr" fill="#3faf82">
                                    <LabelList dataKey="count" position="top" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </>
    );
};

export default CourseAnalytics;
