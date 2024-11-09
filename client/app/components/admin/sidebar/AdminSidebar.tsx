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
import { Box, IconButton, TextareaAutosize, Typography } from '@mui/material';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import avatarDefautl from '../../../../public/assets/avatar.png';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { redirect } from 'next/navigation';
import { styles } from '../../../utils/style';
import { useLogoutQuery } from '../../../../redux/features/auth/authApi';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { ROLE } from '../../../constants/enum';

interface ItemProps {
    title: string;
    to: string;
    icon: JSX.Element;
    selected: string;
    setSelected: (selected: string) => void;
    isDifferent?: boolean;
}

const Item: FC<ItemProps> = (props) => {
    const { title, to, icon, selected, setSelected, isDifferent } = props;
    return (
        <div>
            <MenuItem active={selected === title} onClick={() => setSelected(title)} icon={icon}>
                <Typography
                    className={`${isDifferent ? 'text-[20px]' : '!text-[1rem]'} !font-Poppins font-semibold text-black dark:text-white`}
                >
                    {title}
                </Typography>
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
    const {} = useLogoutQuery(undefined, {
        skip: !logout ? true : false
    });
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleRedirect = (to: string) => {
        return router.push(to);
    };
    const logOutHandler = async () => {
        setLogout(true);
        handleRedirect('/');
        await signOut();
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
                                    <h3 className="font-Poppins text-[25px] font-bold uppercase text-black dark:text-white">
                                        ELearning
                                    </h3>
                                </Link>
                                <MenuItem
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                    className="inline-block"
                                    icon={
                                        isCollapsed ? (
                                            <ArrowForwardIosIcon />
                                        ) : (
                                            <ArrowBackIosIcon className="mb-1 text-black dark:text-[#fff]" />
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
                                    className={`!text-[20px] font-bold capitalize text-black dark:text-[#fff]`}
                                    sx={{ m: '10px 0 0 0 ' }}
                                >
                                    {user?.name}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{ m: '10px 0 0 0 ' }}
                                    className={`!text-[16px] font-bold capitalize text-black dark:text-[#fff]`}
                                >
                                    {user?.role === ROLE.ADMIN && 'Quản trị viên'}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box paddingLeft={isCollapsed ? undefined : '10%'}>
                        <Item
                            title="Tổng quát"
                            to="/admin"
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            isDifferent
                        />

                        <Typography variant="h5" sx={{ m: '15px 0 5px 25px' }} className={styles.title_admin_sidebar}>
                            {!isCollapsed && 'Quản lý'}
                        </Typography>
                        <Item
                            title="Người dùng"
                            to="/admin/user/all"
                            icon={<GroupsIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Khóa học"
                            to="/admin/course/all"
                            icon={<OndemandVideoIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Hóa đơn"
                            to="/admin/invoices"
                            icon={<ReceiptOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Quản trị viên"
                            to="/admin/team"
                            icon={<ManageHistoryIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        {/* <Typography variant="h5" sx={{ m: '15px 0 5px 20px' }} className={styles.title_admin_sidebar}>
                            {!isCollapsed && 'Khoá học'}
                        </Typography> */}
                        {/* <Item
                            title="Tạo mới"
                            to="/admin/course/create"
                            icon={<VideoCallIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Danh sách"
                            to="/admin/course/all"
                            icon={<OndemandVideoIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        /> */}
                        <Typography variant="h5" sx={{ m: '15px 0 5px 20px' }} className={styles.title_admin_sidebar}>
                            {!isCollapsed && 'Tuỳ chỉnh'}
                        </Typography>
                        <Item
                            title="Trang chủ"
                            to="/admin/hero"
                            icon={<WebIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="FAQ"
                            to="/admin/faq"
                            icon={<QuizIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Thể loại"
                            to="/admin/Categories"
                            icon={<WysiwygIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography variant="h6" sx={{ m: '15px 0 5px 20px' }} className={styles.title_admin_sidebar}>
                            {!isCollapsed && 'Phân tích'}
                        </Typography>
                        <Item
                            title="Tổng quan"
                            to="/admin/analytics"
                            icon={<BarChartOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Đơn hàng"
                            to="/admin/orders-analytics"
                            icon={<MapOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Người dùng"
                            to="/admin/users-analytics"
                            icon={<ManageHistoryIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography variant="h6" sx={{ m: '15px 0 5px 20px' }} className={styles.title_admin_sidebar}>
                            {!isCollapsed && 'Mở rộng'}
                        </Typography>
                        <Item
                            title="Cài đặt"
                            to="/admin/settings"
                            icon={<SettingsIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <div onClick={logOutHandler}>
                            <MenuItem icon={<ExitToAppIcon />} onClick={logOutHandler}>
                                <Typography
                                    className={`!font-Poppins !text-[1rem] font-semibold text-black dark:text-white`}
                                >
                                    Đăng xuất
                                </Typography>
                            </MenuItem>
                        </div>
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default AdminSidebar;
