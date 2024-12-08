import { Box, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTheme } from 'next-themes';
import { FC, useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineInfo } from 'react-icons/ai';
import Loading from '../../../../components/common/Loading';

import { useRouter } from 'next/navigation';
import { useGetAllReviewsQuery } from '../../../../redux/features/review/reviewApi';

interface AllReviewProps {}

const AllReview: FC<AllReviewProps> = (props) => {
  const { theme, setTheme } = useTheme();
  const [openModel, setOpenModel] = useState(false);
  const router = useRouter();
  const [id, setId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [loading, setLoading] = useState(false);
  const { isLoading, isSuccess, error, data, refetch } = useGetAllReviewsQuery(
    {},
    {
      refetchOnMountOrArgChange: true
    }
  );
  //   const [
  //     deleteComment,
  //     { isLoading: deleteCommentLoading, isSuccess: deleteCommentSuccess, error: deleteCommentError }
  //   ] = useDeleteCommentMutation();

  const handleRedirectToCourseThroughId = (id: string) => {
    setLoading(true);
    router.push(`/course/access/${id}`);
  };

  const rows: any[] = [];

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'review',
      headerName: 'Đánh giá',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'course',
      headerName: 'Mã khóa học',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'rating',
      headerName: 'Số sao',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'createdAt',
      headerName: 'Ngày bình luận',
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
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleRedirectToCourseThroughId(params.row.course);
              }}
            >
              <AiOutlineInfo className="text-black dark:text-white" size={20} />
            </Button>
          </Box>
        );
      }
    }
  ];

  if (Array.isArray(data?.reviews)) {
    data?.reviews?.forEach((review: any) => {
      const createdAt = new Date(review?.createdAt || '');
      const formattedDate = !isNaN(createdAt.getTime()) ? createdAt.toLocaleDateString('en-US') : 'Invalid Date';
      rows.push({
        id: review?._id,
        review: review?.review,
        course: review?.course,
        rating: review?.rating,
        createdAt: formattedDate
      });
    });
  }

  //   const handleSubmitDeleteCategory = async () => {
  //     await deleteComment({
  //       commentId: id,
  //       courseId: courseId,
  //       contentId: contentId
  //     });
  //     setOpenDeleteModal(false);
  //   };

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);

  //   useEffect(() => {
  //     if (deleteCommentSuccess) {
  //       refetch();
  //       toast.success('Xóa bình luận thành công');
  //     }
  //     if (deleteCommentError) {
  //       toast.error('Xóa bình luận thất bại');
  //     }
  //   }, [deleteCommentSuccess, deleteCommentError]);
  return (
    <div className="ml-12 mt-[120px]">
      {isLoading || loading ? (
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
          {/* {openDeleteModal && (
            <ConfirmationModal
              open={openDeleteModal}
              setOpen={setOpenDeleteModal}
              title="Xác nhận xóa"
              message={`Bạn có chắc chắn muốn xóa bình luận không?`}
              onConfirm={handleSubmitDeleteCategory}
            />
          )} */}
        </Box>
      )}
    </div>
  );
};

export default AllReview;
