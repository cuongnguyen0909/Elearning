import { Box, Button } from '@mui/material';
import { useTheme } from 'next-themes';
import React, { FC } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { FiEdit2 } from 'react-icons/fi';
import { useGetAllCoursesQuery } from '../../../../../redux/features/course/courseApi';
import Loading from '../../../../../components/common/Loading';
import { parseISO, format } from 'date-fns';
import { useGetAllUsersQuery } from '../../../../../redux/features/user/userApi';
import { BiLock } from 'react-icons/bi';
interface AllUsersProps {}

const AllUsers: FC<AllUsersProps> = (props) => {
   const { theme, setTheme } = useTheme();
   const rows: any[] = [];
   const { isLoading, data, error } = useGetAllUsersQuery({});
   const usersData = data?.users;
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
         headerName: 'User name',
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
         headerName: 'Role',
         minWidth: 150,
         headerAlign: 'center',
         align: 'center'
      },
      {
         field: 'courses',
         headerName: 'Purchased courses',
         minWidth: 200,
         headerAlign: 'center',
         align: 'center'
      },
      {
         field: 'isVerified',
         headerName: 'Verified',
         minWidth: 100,
         headerAlign: 'center',
         align: 'center'
      },
      {
         field: 'isBlocked',
         headerName: 'Blocked',
         minWidth: 100,
         headerAlign: 'center',
         align: 'center'
      },
      {
         field: 'created_at',
         headerName: 'Created at',
         minWidth: 150,
         headerAlign: 'center',
         align: 'center'
      },
      {
         field: 'actions',
         headerName: 'Actions',
         //  renderHeader: () => (
         //     <Box display="flex" gap={1}>
         //        <Button variant="contained" color="primary" size="small">
         //           Lock
         //        </Button>
         //        <Button variant="contained" color="secondary" size="small">
         //           Button 2
         //        </Button>
         //     </Box>
         //  ),
         headerAlign: 'center',
         //  align: 'center',
         renderCell: (params: any) => (
            <Box className="mt-2 flex items-center justify-center">
               <Button>
                  <BiLock size={20} className="text-black dark:text-white" title="Block this user" />
               </Button>
               <Button>
                  <AiOutlineDelete size={20} className="text-black dark:text-white" title="Delete this user" />
               </Button>
            </Box>
         ),
         sortable: false,
         width: 200
      }
   ];

   if (Array.isArray(usersData)) {
      usersData?.forEach((user: any) => {
         const createdAt = new Date(user?.createdAt || '');
         const formattedDate = !isNaN(createdAt.getTime()) ? createdAt.toLocaleDateString('en-US') : 'Invalid Date';
         rows.push({
            id: user?._id,
            name: user?.name,
            email: user?.email,
            role: user?.role === '2' ? 'User' : 'Admin',
            courses: user?.courses.length,
            isVerified: user?.isVerified ? 'Yes' : 'No',
            isBlocked: user?.isBlocked ? 'Yes' : 'No',
            created_at: formattedDate
         });
      });
   }

   return (
      <div className="ml-14 mt-[120px]">
         {isLoading ? (
            <Loading />
         ) : (
            <Box m="20px">
               <Box
                  m="40px 0 0 0 "
                  height="80vh"
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
      </div>
   );
};

export default AllUsers;
