import { useTheme } from 'next-themes';
import React, { FC, useEffect, useState } from 'react';
import { useGetAllEnrollmentsQuery } from '../../../../redux/features/enrollment/enrollmentApi';
import { useGetAllUsersQuery } from '../../../../redux/features/user/userApi';
import { useGetAllCoursesQuery } from '../../../../redux/features/course/courseApi';
import Loading from '../../../../components/common/Loading';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styles } from '../../../utils/style';

interface AllEnrollmentsProps {
    isDashboard: boolean;
}

const AllEnrollments: FC<AllEnrollmentsProps> = (props) => {
    const { isDashboard } = props;
    const { theme, setTheme } = useTheme();
    const {
        data: enrollments,
        error: enrollmentsError,
        isLoading: enrollmentsIsLoading,
        refetch: refetchEnrollments,
        isSuccess: enrollmentsIsSuccess
    } = useGetAllEnrollmentsQuery(
        {},
        {
            refetchOnMountOrArgChange: true
        }
    );
    const {
        data: users,
        error: usersError,
        isLoading: usersIsLoading
    } = useGetAllUsersQuery(
        {},
        {
            refetchOnMountOrArgChange: true
        }
    );
    const {
        data: courses,
        error: coursesError,
        isLoading: coursesIsLoading
    } = useGetAllCoursesQuery(
        {},
        {
            refetchOnMountOrArgChange: true
        }
    );
    // console.log(enrollments, users, courses);
    const [enrollmentData, setEnrollmentData] = useState([]);
    useEffect(() => {
        if (enrollments) {
            const tempData = enrollments?.enrollments?.map((enrollment: any) => {
                const user = users?.users?.find((user: any) => user._id === enrollment?.user?._id);
                const course = courses?.courses?.find((course: any) => course._id === enrollment?.course?._id);
                console.log(user, course);
                return {
                    ...enrollment,
                    userName: user?.name,
                    userEmail: user?.email,
                    title: course?.title,
                    price: '$' + course?.price
                };
            });
            setEnrollmentData(tempData);
        }
    }, [enrollments, users, courses]);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100
        },
        {
            field: 'userName',
            headerName: 'Tên học viên',
            width: 200
        },
        {
            field: 'userEmail',
            headerName: 'Email học viên',
            width: 200
        },
        {
            field: 'title',
            headerName: 'Tên khóa học',
            width: 200
        },
        {
            field: 'price',
            headerName: 'Giá tiền',
            width: 150
        },
        {
            field: 'createdAt',
            headerName: 'Ngày tạo',
            width: 150
        }
    ];
    const rows: any[] = [];
    if (enrollmentData) {
        enrollmentData.forEach((enrollment: any) => {
            rows.push({
                id: enrollment._id,
                userName: enrollment.userName,
                userEmail: enrollment.userEmail,
                title: enrollment.title,
                price: enrollment.price,
                createdAt: enrollment.createdAt
            });
        });
    }

    useEffect(() => {
        if (enrollmentsIsSuccess) {
            refetchEnrollments();
        }
    }, [enrollmentsIsSuccess]);

    return (
        <div className="ml-12 mt-[120px]">
            {enrollmentsIsLoading ? (
                <Loading />
            ) : (
                <Box m="20px">
                    <Box
                        m="40px 0 0 0 "
                        height="75vh"
                        sx={{
                            '& .MuiDataGrid-root': {
                                border: 'none',
                                outline: 'none'
                            },
                            '& .css-1gpuzre-MuiSvgIcon-root-MuiSelect-icon': {
                                color: theme === 'dark' ? '#fff' : '#000'
                            },
                            '& .MuiDataGrid-sortIcon': {
                                color: theme === 'dark' ? '#fff' : '#000'
                            },
                            '& .MuiDataGrid-row': {
                                color: theme === 'dark' ? '#fff' : '#000',
                                borderBottom:
                                    theme === 'dark' ? '1px solid #ffffff30 !important' : '1px solid #ccc !important'
                            },
                            '& .MuiTablePagination-root': {
                                color: theme === 'dark' ? '#fff' : '#000',
                                backgroundColor: theme === 'dark' ? '#3e4396' : '#A4A9FC'
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: 'none'
                            },
                            '& .name-column--cell': {
                                color: theme === 'dark' ? '#fff' : '#000'
                            },
                            '& .MuiDataGrid-topContainer': {
                                backgroundColor: theme === 'dark' ? '#3e4396!important' : '#A4A9FC!important',
                                borderBottom: 'none',
                                color: theme === 'dark' ? '#fff' : '#000'
                            },
                            '& .MuiDataGrid-columnHeader': {
                                backgroundColor: theme === 'dark' ? '#3e4396 !important' : '#A4A9FC !important',
                                borderBottom: 'none',
                                color: theme === 'dark' ? '#fff !important' : '#000 !important'
                            },
                            '& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeaderTitle': {
                                color: theme === 'dark' ? '#fff' : '#000'
                            },
                            '& .MuiDataGrid-virtualScroller': {
                                backgroundColor: theme === 'dark' ? '#1F2A40' : '#F2F0F0'
                            },
                            '& .MuiDataGrid-footerContainer': {
                                color: theme === 'dark' ? '#fff' : '#000',
                                borderTop: 'none',
                                backgroundColor: theme === 'dark' ? '#3e4396' : '#A4A9FC'
                            },
                            '& .MuiCheckbox-root': {
                                color: theme === 'dark' ? '#fff' : '#000 !important'
                            },
                            '& .MuiToolbar-root': {
                                backgroundColor: theme === 'dark' ? '#3e4396' : '#A4A9FC'
                            },
                            '& .MuiTablePagination-actions': {
                                color: theme === 'dark' ? '#fff !important' : '#000 !important'
                            }
                        }}
                    >
                        <DataGrid checkboxSelection rows={rows} columns={columns} />
                    </Box>
                </Box>
            )}
        </div>
    );
};

export default AllEnrollments;
