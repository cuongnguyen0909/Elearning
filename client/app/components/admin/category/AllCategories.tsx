import { Box, Button, Modal } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { FiEdit2 } from 'react-icons/fi';
import Loading from '../../../../components/common/Loading';
import {
    useCreateCategoryMutation,
    useGetAllCategoriesQuery,
    useEditCategoryMutation,
    useDeleteCategoryMutation
} from '../../../../redux/features/category/categoryApi';
import { styles } from '../../../utils/style';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../../../components/modal/ConfimationModal';

interface AllCoursesProps {}

const AllCategories: FC<AllCoursesProps> = (props) => {
    const { theme, setTheme } = useTheme();
    const [active, setActive] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [title, setTitle] = useState('');
    const [id, setId] = useState('');
    const { isLoading, isSuccess, error, data, refetch } = useGetAllCategoriesQuery(
        {},
        {
            refetchOnMountOrArgChange: true
        }
    );
    const [createCategory, { isLoading: isCreating, isSuccess: isCreated, error: createError }] =
        useCreateCategoryMutation();
    const [editCategory, { isLoading: isEditing, isSuccess: isEdited, error: editError }] = useEditCategoryMutation();
    const [deleteCategory, { isLoading: isDeleting, isSuccess: isDeleted, error: deleteError }] =
        useDeleteCategoryMutation();
    const rows: any[] = [];
    const categories = data?.categories;

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
            headerName: 'Tên thể loại',
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
                                setActive(!active);
                                setOpenEditModal(true);
                                setId(params.row.id);
                                setTitle(params.row.title);
                            }}
                        >
                            <FiEdit2 className="text-black dark:text-white" size={20} />
                        </Button>
                        <Button
                            onClick={() => {
                                setOpenDeleteModal(true);
                                setId(params.row.id);
                                setTitle(params.row.title);
                            }}
                        >
                            <AiOutlineDelete className="text-black dark:text-white" size={20} />
                        </Button>
                    </Box>
                );
            }
        }
    ];

    if (Array.isArray(categories)) {
        categories?.forEach((category: any) => {
            const createdAt = new Date(category?.createdAt || '');
            const formattedDate = !isNaN(createdAt.getTime()) ? createdAt.toLocaleDateString('en-US') : 'Invalid Date';
            rows.push({
                id: category?._id,
                title: category?.title,
                created_at: formattedDate
            });
        });
    }

    const handleSbmitAddCategory = async () => {
        await createCategory({ title });
        setActive(!active);
        setTitle('');
    };

    const handelSubmitEditCategory = async () => {
        await editCategory({ id, title });
        setActive(!active);
        setTitle('');
    };

    const handleSubmitDeleteCategory = async () => {
        await deleteCategory({ id, title });
        setOpenDeleteModal(false);
        setTitle('');
    };

    useEffect(() => {
        if (isSuccess) {
            refetch();
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isCreated) {
            refetch();
            toast.success('Thêm thể loại thành công', {
                duration: 2000
            });
        }
        if (createError) {
            if ('data' in createError) {
                const errorData = createError.data as any;
                toast.error(errorData.message, {
                    duration: 2000
                });
            }
        }
    }, [isCreated, createError]);

    useEffect(() => {
        if (isEdited) {
            refetch();
            toast.success('Chỉnh sửa thể loại thành công', {
                duration: 2000
            });
            setOpenEditModal(false);
            setTitle('');
        }
        if (editError) {
            if ('data' in editError) {
                const errorData = editError.data as any;
                toast.error(errorData.message, {
                    duration: 2000
                });
            }
        }
    }, [isEdited, editError]);

    useEffect(() => {
        if (isDeleted) {
            refetch();
            toast.success('Xóa thể loại thành công', {
                duration: 2000
            });
            setOpenDeleteModal(false);
            setTitle('');
        }
        if (deleteError) {
            if ('data' in deleteError) {
                const errorData = deleteError.data as any;
                toast.error(errorData.message, {
                    duration: 2000
                });
            }
        }
    }, [isDeleted, deleteError]);
    return (
        <div className="ml-12 mt-[120px]">
            {isLoading ? (
                <Loading />
            ) : (
                <Box m="20px">
                    <div className="flex w-full justify-end">
                        <div
                            className={`${styles.button} fixed top-24 !h-[16px] !w-[15%] bg-[#7eb0c457] text-[14px] text-black dark:border dark:border-[#fff] dark:bg-[#2190ff] dark:text-white`}
                            onClick={() => setActive(!active)}
                        >
                            Thêm thể loại
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
                    {active && (
                        <Modal
                            open={active}
                            onClose={() => setActive(!active)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box className="absolute left-[50%] top-[50%] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-[8px] bg-white p-4 shadow outline-none dark:bg-slate-900">
                                <h1 className={`${styles.title}`}>Thêm mới thể loại</h1>
                                <div>
                                    <input
                                        type="category"
                                        placeholder="Nhập tên thể loại..."
                                        className={`${styles.input}`}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <div className={`${styles.button} mt-6 !h-[30px]`} onClick={handleSbmitAddCategory}>
                                        Thêm
                                    </div>
                                </div>
                            </Box>
                        </Modal>
                    )}
                    {openEditModal && (
                        <Modal
                            open={active}
                            onClose={() => setActive(!active)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box className="absolute left-[50%] top-[50%] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-[8px] bg-white p-4 shadow outline-none dark:bg-slate-900">
                                <h1 className={`${styles.title}`}>Chỉnh sửa thể loại</h1>
                                <div>
                                    <input
                                        type="category"
                                        placeholder="Nhập tên thể loại..."
                                        className={`${styles.input}`}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <div
                                        className={`${styles.button} mt-6 !h-[30px]`}
                                        onClick={handelSubmitEditCategory}
                                    >
                                        Cập nhật
                                    </div>
                                </div>
                            </Box>
                        </Modal>
                    )}
                    {openDeleteModal && (
                        <ConfirmationModal
                            open={openDeleteModal}
                            setOpen={setOpenDeleteModal}
                            title="Xác nhận xóa"
                            message={`Bạn có chắc chắn muốn xóa thể loại '${title}' không?`}
                            onConfirm={handleSubmitDeleteCategory}
                        />
                    )}
                </Box>
            )}
        </div>
    );
};

export default AllCategories;
