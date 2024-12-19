import { Box, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { FiEdit2 } from 'react-icons/fi';
import Loading from '../../../../../components/common/Loading';
import { useDeleteCourseMutation, useGetAllCoursesQuery } from '../../../../../redux/features/course/courseApi';
import { styles } from '../../../../utils/style';
import { useRouter } from 'next/navigation';
import ConfirmationModal from '../../../../../components/modal/ConfimationModal';
import toast from 'react-hot-toast';
interface AllCoursesProps {}

const AllCourses: FC<AllCoursesProps> = (props) => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [couseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const { isLoading, isSuccess, error, data, refetch } = useGetAllCoursesQuery(
    {},
    {
      refetchOnMountOrArgChange: true
    }
  );
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [deleteCourse, { isLoading: isDeleting, isSuccess: isDeleteSuccess, error: deleteError }] =
    useDeleteCourseMutation();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const handleEditClick = (id: string) => {
    setLoadingEdit(true);
    router.push(`/admin/course/edit/${id}`);
  };

  const handleCreateClick = () => {
    setLoadingEdit(true);
    router.push('/admin/course/create');
  };
  const rows: any[] = [];
  const courses = data?.courses;

  const handleDeteleCourse = async () => {
    try {
      await deleteCourse(couseId);
      setOpenDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  };

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
      headerName: 'Tên khoá học',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'category',
      headerName: 'Thể loại',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'ratings',
      headerName: 'Đánh giá',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5
    },
    {
      field: 'purchased',
      headerName: 'Đã bán',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5
    },
    {
      field: 'created_at',
      headerName: 'Ngày tạo',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params: any) => {
        return (
          <Box className="mt-2 flex items-center justify-center">
            <FiEdit2
              className="cursor-pointer text-black dark:text-white"
              size={20}
              onClick={() => handleEditClick(params.row.id)} // Gọi hàm xử lý khi click Edit
            />

            <Button
              onClick={() => {
                setCourseId(params.row.id);
                setOpenDeleteModal(true);
                setTitle(params.row.title);
              }} // Gọi hàm xử lý khi click Delete
            >
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
      console.log(course?.ratings);
      rows.push({
        id: course?._id,
        title: course?.title,
        category: course?.category?.title,
        ratings: course?.rating?.toFixed(1),
        purchased: course?.purchased,
        created_at: formattedDate
      });
    });
  }
  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success('Xóa khóa học thành công', {
        duration: 2000
      });
      refetch();
    }
  }, [isDeleteSuccess]);

  return (
    <div className="ml-12 mt-[120px]">
      {isLoading || loadingEdit ? (
        <Loading />
      ) : (
        <Box m="20px">
          <div className="flex w-full justify-end">
            <div
              className={`${styles.button} fixed top-24 !h-[30px] !w-[15%] bg-[#7eb0c457] text-black dark:border dark:border-[#fff] dark:bg-[#2190ff] dark:text-white`}
            >
              <Button className="dark:font-semibold dark:text-white" onClick={() => handleCreateClick()}>
                Thêm khóa học
              </Button>
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
                borderBottom: theme === 'dark' ? '1px solid #ffffff30 !important' : '1px solid #ccc !important'
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
      {openDeleteModal && (
        <ConfirmationModal
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa khóa học '${title}' không?`}
          onConfirm={handleDeteleCourse}
        />
      )}
    </div>
  );
};

export default AllCourses;
