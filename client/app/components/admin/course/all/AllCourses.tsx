import { Box, Button } from '@mui/material';
import { useTheme } from 'next-themes';
import React, { FC } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { FiEdit2 } from 'react-icons/fi';
import { useGetAllCoursesQuery } from '../../../../../redux/features/course/courseApi';
import Loading from '../../../../../components/common/Loading';
import { parseISO, format } from 'date-fns';
import { styles } from '../../../../utils/style';
import Link from 'next/link';
interface AllCoursesProps {}

const AllCourses: FC<AllCoursesProps> = (props) => {
    const { theme, setTheme } = useTheme();
    const { isLoading, isSuccess, error, data } = useGetAllCoursesQuery({});
    const rows: any[] = [];
    const courses = data?.courses;

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'title',
            headerName: 'Course title',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'ratings',
            headerName: 'Ratings',
            headerAlign: 'center',
            align: 'center',
            flex: 0.5
        },
        {
            field: 'purchased',
            headerName: 'Purchased',
            headerAlign: 'center',
            align: 'center',
            flex: 0.5
        },
        {
            field: 'created_at',
            headerName: 'Created at',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'actions',
            headerName: 'Actions',
            headerAlign: 'center',
            flex: 1,
            renderCell: (params: any) => {
                return (
                    <Box className="mt-2 flex items-center justify-center">
                        <Button>
                            <FiEdit2 className="text-black dark:text-white" size={20} />
                        </Button>
                        <Button>
                            <AiOutlineDelete className="text-black dark:text-white" size={20} />
                        </Button>
                    </Box>
                );
            }
        }
    ];

    if (Array.isArray(courses)) {
        courses?.forEach((course: any) => {
            const createdAt = new Date(course?.createdAt || '');
            const formattedDate = !isNaN(createdAt.getTime()) ? createdAt.toLocaleDateString('en-US') : 'Invalid Date';
            rows.push({
                id: course?._id,
                title: course?.title,
                ratings: course?.rating,
                purchased: course?.purchased,
                created_at: formattedDate
            });
        });
    }

    return (
        <div className="mt-[120px]">
            {isLoading ? (
                <Loading />
            ) : (
                <Box m="20px">
                    <div className="flex w-full justify-end">
                        <div
                            className={`${styles.button} fixed top-24 !h-[30px] !w-[15%] bg-[#7eb0c457] text-black dark:border dark:border-[#fff] dark:bg-[#2190ff] dark:text-white`}
                        >
                            <Link href="/admin/course/create" passHref>
                                Thêm khóa học
                            </Link>
                        </div>
                    </div>
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

export default AllCourses;
