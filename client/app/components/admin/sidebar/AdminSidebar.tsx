'use client';
import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
   HomeOutlinedIcon,
   ArrowForwardIosIcon,
   ArrowBackIosIcon,
   PeopleOutlinedIcon,
   ReceiptOutlinedIcon,
   BarChartOutlinedIcon,
   MapOutlinedIcon,
   GroupsIcon,
   OndemandVideoIcon,
   VideoCallIcon,
   WebIcon,
   QuizIcon,
   WysiwygIcon,
   ManageHistoryIcon,
   SettingsIcon,
   ExitToAppIcon
} from './Icon';
import 'react-pro-sidebar/dist/css/styles.css';
import { Box, IconButton, Typography } from '@mui/material';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import avatarDefautl from '../../../../public/assets/avatar.png';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { redirect } from 'next/navigation';

interface ItemProps {
   title: string;
   to: string;
   icon: JSX.Element;
   selected: string;
   setSelected: (selected: string) => void;
}

const Item: FC<ItemProps> = (props) => {
   const { title, to, icon, selected, setSelected } = props;
   return (
      <div>
         <MenuItem active={selected === title} onClick={() => setSelected(title)} icon={icon}>
            <Typography className="!font-Poppins !text-[16px]">{title}</Typography>
            <Link href={to} />
         </MenuItem>
      </div>
   );
};

const AdminSidebar: FC = () => {
   const { user } = useSelector((state: any) => state.auth);
   const [logout, setLogout] = useState(false);
   const [isCollapsed, setIsCollapsed] = useState(false);
   const [selected, setSelected] = useState('Dashboard');
   const [mounted, setMounted] = useState(false);
   const { theme } = useTheme();
   const router = useRouter();
   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) return null;

   const logoutHandler = () => {};

   const handleRedirect = (to: string) => {
      return router.push(to);
   };

   return (
      <Box
         sx={{
            '& .pro-sidebar-inner': {
               backgroundColor: `${theme === 'dark' ? '#111C43 !important' : '#fff !important'}`
            },
            '& .pro-icon-wrapper': {
               backgroundColor: 'transparent !important'
            },
            '& .pro-inner-item:hover': {
               color: '#868dfb !important'
            },
            '& .pro-menu-item.active': {
               color: '#6870fa !important'
            },
            '& .pro-inner-item': {
               padding: '5px 35px 5px 20px !important',
               opacity: 1
            },
            '& .pro-menu-item': {
               color: `${theme !== 'dark' && '#000'}`
            }
         }}
         className="!bg-white dark:bg-[#111C43]"
      >
         <ProSidebar
            collapsed={isCollapsed}
            style={{
               position: 'fixed',
               top: 0,
               left: 0,
               height: '100vh',
               width: isCollapsed ? '0%' : '16%'
            }}
         >
            <Menu iconShape="square">
               <MenuItem
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
                  style={{
                     margin: '10px 0 20px 0'
                  }}
               >
                  {!isCollapsed && (
                     <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                        <Link href={'/'} onClick={(e) => e.stopPropagation()}>
                           <h3 className="font-Poppins text-[25px] uppercase text-black dark:text-white">ELearning</h3>
                        </Link>
                        <MenuItem
                           onClick={() => setIsCollapsed(!isCollapsed)}
                           className="inline-block"
                           icon={
                              isCollapsed ? (
                                 <ArrowForwardIosIcon />
                              ) : (
                                 <ArrowBackIosIcon className="mb-1 text-black dark:text-[#ffffffc1]" />
                              )
                           }
                        />
                     </Box>
                  )}
               </MenuItem>

               {!isCollapsed && (
                  <Box mb="25px">
                     <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <Image
                           alt="profile-user"
                           width={100}
                           height={100}
                           src={user.avatar ? user.avatar.url : avatarDefautl}
                           style={{
                              cursor: 'pointer',
                              borderRadius: '50%',
                              border: '3px solid #5b6fe6'
                           }}
                           onClick={() => handleRedirect('/profile')}
                        />
                     </Box>
                     <Box textAlign={'center'}>
                        <Typography
                           variant="h4"
                           className="!text-[20px] capitalize text-black dark:text-[#ffffffc1]"
                           sx={{ m: '10px 0 0 0 ' }}
                        >
                           {user?.name}
                        </Typography>
                        <Typography
                           variant="h6"
                           sx={{ m: '10px 0 0 0 ' }}
                           className="!text-[20px] capitalize text-black dark:text-[#ffffffc1]"
                        >
                           - {user?.role === '99858' && 'admin'}
                        </Typography>
                     </Box>
                  </Box>
               )}

               <Box paddingLeft={isCollapsed ? undefined : '10%'}>
                  <Item
                     title="Dashboard"
                     to="/admin"
                     icon={<HomeOutlinedIcon />}
                     selected={selected}
                     setSelected={setSelected}
                  />

                  <Typography
                     variant="h5"
                     sx={{ m: '15px 0 5px 25px' }}
                     className="!text-[18px] !font-[400] capitalize text-black dark:text-[#ffffffc1]"
                  >
                     {!isCollapsed && 'Data'}
                  </Typography>
                  <Item
                     title="Users"
                     to="/admin/user/all"
                     icon={<GroupsIcon />}
                     selected={selected}
                     setSelected={setSelected}
                  />
                  <Item
                     title="Invoices"
                     to="/admin/invoices"
                     icon={<ReceiptOutlinedIcon />}
                     selected={selected}
                     setSelected={setSelected}
                  />
                  <Typography
                     variant="h5"
                     sx={{ m: '15px 0 5px 20px' }}
                     className="!text-[18px] !font-[400] capitalize text-black dark:text-[#ffffffc1]"
                  >
                     {!isCollapsed && 'Content'}
                  </Typography>
                  <Item
                     title="Create Courses"
                     to="/admin/course/create"
                     icon={<VideoCallIcon />}
                     selected={selected}
                     setSelected={setSelected}
                  />
                  <Item
                     title="Live Courses"
                     to="/admin/course/all"
                     icon={<OndemandVideoIcon />}
                     selected={selected}
                     setSelected={setSelected}
                  />
                  <Typography
                     variant="h5"
                     sx={{ m: '15px 0 5px 20px' }}
                     className="!text-[18px] !font-[400] capitalize text-black dark:text-[#ffffffc1]"
                  >
                     {!isCollapsed && 'Customization'}
                  </Typography>
                  <Item
                     title="Hero"
                     to="/admin/hero"
                     icon={<WebIcon />}
                     selected={selected}
                     setSelected={setSelected}
                  />
                  <Item title="FAQ" to="/admin/faq" icon={<QuizIcon />} selected={selected} setSelected={setSelected} />
                  <Item
                     title="Categories"
                     to="/admin/Categories"
                     icon={<WysiwygIcon />}
                     selected={selected}
                     setSelected={setSelected}
                  />
                  <Typography
                     variant="h5"
                     sx={{ m: '15px 0 5px 20px' }}
                     className="!text-[18px] !font-[400] capitalize text-black dark:text-[#ffffffc1]"
                  >
                     {!isCollapsed && 'Controllers'}
                  </Typography>
                  <Item
                     title="Manage Team"
                     to="/admin/team"
                     icon={<ManageHistoryIcon />}
                     selected={selected}
                     setSelected={setSelected}
                  />
                  <Typography
                     variant="h6"
                     sx={{ m: '15px 0 5px 20px' }}
                     className="!text-[18px] !font-[400] capitalize text-black dark:text-[#ffffffc1]"
                  >
                     {!isCollapsed && 'Analytics'}
                  </Typography>
                  <Item
                     title="Analytics"
                     to="/admin/analytics"
                     icon={<BarChartOutlinedIcon />}
                     selected={selected}
                     setSelected={setSelected}
                  />
                  <Item
                     title="Orders Analytics"
                     to="/admin/orders-analytics"
                     icon={<MapOutlinedIcon />}
                     selected={selected}
                     setSelected={setSelected}
                  />
                  <Item
                     title="Users Analytics"
                     to="/admin/users-analytics"
                     icon={<ManageHistoryIcon />}
                     selected={selected}
                     setSelected={setSelected}
                  />
                  <Typography
                     variant="h6"
                     sx={{ m: '15px 0 5px 20px' }}
                     className="!text-[18px] !font-[400] capitalize text-black dark:text-[#ffffffc1]"
                  >
                     {!isCollapsed && 'Extras'}
                  </Typography>
                  <Item
                     title="Settings"
                     to="/admin/settings"
                     icon={<SettingsIcon />}
                     selected={selected}
                     setSelected={setSelected}
                  />
                  <div onClick={logoutHandler}>
                     <Item
                        title="Logout"
                        to="/"
                        icon={<ExitToAppIcon />}
                        selected={selected}
                        setSelected={setSelected}
                     />
                  </div>
               </Box>
            </Menu>
         </ProSidebar>
      </Box>
   );
};

export default AdminSidebar;
