import { Box, Button, Modal } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTheme } from 'next-themes';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoIosUnlock, IoIosLock } from 'react-icons/io';
import Loading from '../../../../../components/common/Loading';
import ConfirmationModal from '../../../../../components/modal/ConfimationModal';
import {
    useBlockUserMutation,
    useDeleteUserAdminRoleMutation,
    useDeleteUserMutation,
    useGetAllUsersQuery,
    useUnLockUserMutation,
    useUpdateUserRoleMutation
} from '../../../../../redux/features/user/userApi';
import { ROLE } from '../../../../constants/enum';
import { styles } from '../../../../utils/style';
import { set } from 'date-fns';
interface AllUsersProps {
    isTeam: boolean;
}

const AllUsers: FC<AllUsersProps> = (props) => {
    const { isTeam } = props;
    const [active, setActive] = useState(false);
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [blockStatus, setBlockStatus] = useState(false);
    const [unlockStatus, setUnlockStatus] = useState(false);
    const [userId, setUserId] = useState('');
    const { theme, setTheme } = useTheme();
    const rows: any[] = [];
    const { isLoading, data, error, refetch } = useGetAllUsersQuery(
        {},
        {
            refetchOnMountOrArgChange: true
        }
    );

    const [
        updateUserRole,
        { isLoading: isUpdating, isSuccess: isUpdated, isError: updateError, error: updateErrorData }
    ] = useUpdateUserRoleMutation();

    const [
        deleteUserAdminRole,
        { isLoading: isRoleDeleting, isSuccess: isRoleDeleted, isError: deleteRoleError, error: deleteRoleErrorData }
    ] = useDeleteUserAdminRoleMutation();

    const [deleteUser, { isLoading: isDeleting, isSuccess: isDeleted, isError: deleteError, error: deleteErrorData }] =
        useDeleteUserMutation();

    const [blockUser, { isLoading: isBlocking, isSuccess: isBlocked, isError: blockError, error: blockErrorData }] =
        useBlockUserMutation();

    const [
        unLockUser,
        { isLoading: isUnLocking, isSuccess: isUnLocked, isError: unLockError, error: unLockErrorData }
    ] = useUnLockUserMutation();

    const usersData = data?.users;
    // const [role, setRole] = useState(ROLE.ADMIN);
    const newUsersData = Array.isArray(usersData) && usersData?.filter((user: any) => user?.role === ROLE.ADMIN);

    if (Array.isArray(usersData)) {
        if (isTeam && Array.isArray(newUsersData)) {
            newUsersData?.forEach((user: any) => {
                const createdAt = new Date(user?.createdAt || '');
                const formattedDate = !isNaN(createdAt.getTime())
                    ? createdAt.toLocaleDateString('vi-VN')
                    : 'Invalid Date';
                rows.push({
                    id: user?._id,
                    name: user?.name,
                    email: user?.email,
                    role: user?.role === ROLE.USER ? 'Người dùng' : 'Quản trị viên',
                    courses: user?.courses.length,
                    isVerified: user?.isVerified ? 'Có' : 'Không',
                    isBlocked: user?.isBlocked ? 'Có' : 'Không',
                    created_at: formattedDate
                });
            });
        } else {
            usersData?.forEach((user: any) => {
                const createdAt = new Date(user?.createdAt || '');
                const formattedDate = !isNaN(createdAt.getTime())
                    ? createdAt.toLocaleDateString('en-US')
                    : 'Ngày không hợp lệ';
                rows.push({
                    id: user?._id,
                    name: user?.name,
                    email: user?.email,
                    role: user?.role === ROLE.USER ? 'Người dùng' : 'Quản trị viên',
                    courses: user?.courses.length,
                    isVerified: user?.isVerified ? 'Có' : 'Không',
                    isBlocked: user?.isBlocked ? 'Có' : 'Không',
                    created_at: formattedDate
                });
            });
        }
    }
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            minWidth: 250,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: 'Tên',
            minWidth: 150,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 300,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'role',
            headerName: 'Quyền',
            minWidth: 150,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'courses',
            headerName: 'Khóa học đã tham gia',
            minWidth: 200,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'isVerified',
            headerName: 'Đã xác thực',
            minWidth: 100,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'isBlocked',
            headerName: 'Đã chặn',
            minWidth: 100,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'created_at',
            headerName: 'Ngày tạo',
            minWidth: 150,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'actions',
            headerName: 'Hành động',
            headerAlign: 'center',
            //  align: 'center',
            renderCell: (params: any) => (
                <Box className={`mt-2 flex ${isTeam ? '' : 'items-center justify-center'} `}>
                    <Button>
                        {!isTeam &&
                            (params.row.isBlocked === 'Có' ? (
                                <IoIosUnlock
                                    size={20}
                                    className="text-black dark:text-white"
                                    title="Mở chặn người dùng"
                                    onClick={() => {
                                        setOpen(!open);
                                        setUnlockStatus(true);
                                        setUserId(params.row.id);
                                    }}
                                />
                            ) : (
                                <IoIosLock
                                    size={20}
                                    className="text-black dark:text-white"
                                    title="Chặn người dùng"
                                    onClick={() => {
                                        setOpen(!open);
                                        setBlockStatus(true);
                                        setUserId(params.row.id);
                                    }}
                                />
                            ))}
                    </Button>
                    <Button>
                        {isTeam ? (
                            <AiOutlineDelete
                                size={20}
                                className="text-black dark:text-white"
                                title="Xóa quyền người dùng"
                                onClick={() => {
                                    setOpen(!open);
                                    setEmail(params.row.email);
                                }}
                            />
                        ) : (
                            <AiOutlineDelete
                                size={20}
                                className="text-black dark:text-white"
                                title="Xóa người dùng"
                                onClick={() => {
                                    setOpen(!open);
                                    setUserId(params.row.id);
                                    setDeleteStatus(true);
                                }}
                            />
                        )}
                    </Button>
                </Box>
            ),
            sortable: false,
            width: 200
        }
    ];

    const handleSubmitUpdateRole = async () => {
        await updateUserRole({ email });
    };

    const deleteAdminRole = async () => {
        await deleteUserAdminRole({ email });
    };

    const deleteUserById = async () => {
        await deleteUser({ id: userId });
    };

    const handleBlockUser = async () => {
        await blockUser({ userId });
    };

    const handleUnlockUser = async () => {
        await unLockUser({ userId });
    };

    useEffect(() => {
        if (isRoleDeleted) {
            refetch();
            toast.success('Xóa quyền quản trị viên thành công', { duration: 2000 });
            setEmail('');
        }
        if (deleteRoleErrorData) {
            if ('data' in deleteRoleErrorData) {
                const err = deleteRoleErrorData as any;
                toast.error(err.data.message, { duration: 2000 });
            }
        }
    }, [isRoleDeleted, deleteRoleErrorData]);

    useEffect(() => {
        if (isUpdated) {
            refetch();
            setEmail('');
            toast.success('Thêm thành viên thành công', { duration: 2000 });
        }
        if (updateErrorData) {
            if ('data' in updateErrorData) {
                const err = updateErrorData as any;
                toast.error(err.data.message, { duration: 2000 });
            }
        }
    }, [isUpdated, updateError]);

    useEffect(() => {
        if (isDeleted) {
            refetch();
            toast.success('Xóa người dùng thành công', { duration: 2000 });
            setDeleteStatus(false);
        }
        if (deleteErrorData) {
            if ('data' in deleteErrorData) {
                const err = deleteErrorData as any;
                toast.error(err.data.message, { duration: 2000 });
            }
        }
    }, [isDeleted, deleteError]);

    useEffect(() => {
        if (isBlocked) {
            refetch();
            toast.success('Chặn người dùng thành công', { duration: 2000 });
            setBlockStatus(false);
        }
        if (blockErrorData) {
            if ('data' in blockErrorData) {
                const err = blockErrorData as any;
                toast.error(err.data.message, { duration: 2000 });
            }
        }
    }, [isBlocked, blockError]);

    useEffect(() => {
        if (isUnLocked) {
            refetch();
            toast.success('Mở chặn người dùng thành công', { duration: 2000 });
            setUnlockStatus(false);
        }
        if (unLockErrorData) {
            if ('data' in unLockErrorData) {
                const err = unLockErrorData as any;
                toast.error(err.data.message, { duration: 2000 });
            }
        }
    }, [isUnLocked, unLockError]);

    return (
        <div className="ml-14 mt-[120px]">
            {isLoading ? (
                <Loading />
            ) : (
                <Box m="20px">
                    {isTeam && (
                        <div className="flex w-full justify-end">
                            <div
                                className={`${styles.button} fixed top-24 !h-[16px] !w-[15%] bg-[#7eb0c457] text-[14px] text-black dark:border dark:border-[#fff] dark:bg-[#2190ff] dark:text-white`}
                                onClick={() => setActive(!active)}
                            >
                                Thêm quản trị viên
                            </div>
                        </div>
                    )}
                    <Box
                        m="40px 0 0 0 "
                        height="75vh"
                        sx={{
                            '& .MuiDataGrid-root': {
                                border: 'none',
                                outline: 'none',
                                overflowX: 'auto'
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
                                <h1 className={`${styles.title}`}>Thêm quản trị viên</h1>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Nhập email..."
                                        className={`${styles.input}`}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <div className={`${styles.button} mt-6 !h-[30px]`} onClick={handleSubmitUpdateRole}>
                                        Thêm
                                    </div>
                                </div>
                            </Box>
                        </Modal>
                    )}

                    {isTeam && open && (
                        <ConfirmationModal
                            title="Xác nhận xóa quyền quản trị viên"
                            open={open}
                            setOpen={setOpen}
                            message="Bạn có chắc chắn muốn xóa quyền quản trị người dùng này?"
                            onConfirm={deleteAdminRole}
                        />
                    )}
                    {open && deleteStatus && (
                        <ConfirmationModal
                            title="Xác nhận xóa người dùng"
                            open={open}
                            setOpen={setActive}
                            message="Bạn có chắc chắn muốn xóa người dùng này?"
                            onConfirm={deleteUserById}
                        />
                    )}
                    {open && blockStatus && (
                        <ConfirmationModal
                            title="Xác nhận chặn người dùng"
                            open={open}
                            setOpen={setOpen}
                            message="Bạn có chắc chắn muốn chặn người dùng này?"
                            onConfirm={handleBlockUser}
                        />
                    )}

                    {open && unlockStatus && (
                        <ConfirmationModal
                            title="Xác nhận mở chặn người dùng"
                            open={open}
                            setOpen={setOpen}
                            message="Bạn có chắc chắn muốn mở chặn người dùng này?"
                            onConfirm={handleUnlockUser}
                        />
                    )}
                </Box>
            )}
        </div>
    );
};

export default AllUsers;
