import { Box, Button, Modal } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTheme } from 'next-themes';
import { FC, useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { FiEdit2 } from 'react-icons/fi';
import Loading from '../../../../components/common/Loading';

import toast from 'react-hot-toast';
import ConfirmationModal from '../../../../components/modal/ConfimationModal';
import { useDeleteCommentMutation, useGetAllCommentsQuery } from '../../../../redux/features/comment/commentApi';
import { styles } from '../../../utils/style';

interface AllCoursesProps {}

const AllCategories: FC<AllCoursesProps> = (props) => {
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [id, setId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [contentId, setContentId] = useState('');
  const { isLoading, isSuccess, error, data, refetch } = useGetAllCommentsQuery(
    {},
    {
      refetchOnMountOrArgChange: true
    }
  );
  const [
    deleteComment,
    { isLoading: deleteCommentLoading, isSuccess: deleteCommentSuccess, error: deleteCommentError }
  ] = useDeleteCommentMutation();

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
      field: 'comment',
      headerName: 'Tên thể loại',
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
      field: 'content',
      headerName: 'Mã bài học',
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
              onClick={() => {
                setOpenDeleteModal(true);
                setId(params.row.id);
                setCourseId(params.row.course);
                setContentId(params.row.content);
              }}
            >
              <AiOutlineDelete className="text-black dark:text-white" size={20} />
            </Button>
          </Box>
        );
      }
    }
  ];

  if (Array.isArray(data?.comments)) {
    data?.comments?.forEach((comment: any) => {
      const createdAt = new Date(comment?.createdAt || '');
      const formattedDate = !isNaN(createdAt.getTime()) ? createdAt.toLocaleDateString('en-US') : 'Invalid Date';
      rows.push({
        id: comment?._id,
        comment: comment?.comment,
        course: comment?.course,
        content: comment?.content,
        createdAt: formattedDate
      });
    });
  }

  const handleSubmitDeleteCategory = async () => {
    await deleteComment({
      commentId: id,
      courseId: courseId,
      contentId: contentId
    });
    setOpenDeleteModal(false);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (deleteCommentSuccess) {
      refetch();
      toast.success('Xóa bình luận thành công');
    }
    if (deleteCommentError) {
      toast.error('Xóa bình luận thất bại');
    }
  }, [deleteCommentSuccess, deleteCommentError]);
  return (
    <div className="ml-12 mt-[120px]">
      {isLoading || deleteCommentLoading ? (
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
          {openDeleteModal && (
            <ConfirmationModal
              open={openDeleteModal}
              setOpen={setOpenDeleteModal}
              title="Xác nhận xóa"
              message={`Bạn có chắc chắn muốn xóa bình luận không?`}
              onConfirm={handleSubmitDeleteCategory}
            />
          )}
        </Box>
      )}
    </div>
  );
};

export default AllCategories;
