'use client';
import { Box, Typography } from '@mui/material';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { Menu, MenuItem, ProSidebar } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { useSelector } from 'react-redux';
import avatarDefautl from '../../../../public/assets/avatar.png';
import { useLogoutQuery } from '../../../../redux/features/auth/authApi';
import { ROLE } from '../../../constants/enum';
import { styles } from '../../../utils/style';
import Loading from '../../../../components/common/Loading';
import {
  ArrowBackIosIcon,
  ArrowForwardIosIcon,
  BarChartOutlinedIcon,
  CategoryOutlinedIcon,
  ExitToAppIcon,
  GroupsIcon,
  HomeOutlinedIcon,
  ManageHistoryIcon,
  MapOutlinedIcon,
  OndemandVideoIcon,
  QuizIcon,
  ReceiptOutlinedIcon,
  SettingsIcon,
  CommentOutlinedIcon,
  FeedbackOutlinedIcon
} from './Icon';

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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleRedirect = (to: string, e: any) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(to);
  };
  return (
    <>
      {isLoading && <Loading />}
      <div>
        <MenuItem active={selected === title} onClick={() => setSelected(title)} icon={icon}>
          <Typography
            className={`${isDifferent ? 'text-[20px]' : '!text-[1rem]'} !font-Arimo font-semibold text-black dark:text-white`}
          >
            {title}
          </Typography>
          <Link href={to} onClick={(e) => handleRedirect(to, e)} />
        </MenuItem>
      </div>
    </>
  );
};

const AdminSidebar: FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [logout, setLogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState('Dashboard');
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const {} = useLogoutQuery(undefined, {
    skip: !logout ? true : false
  });
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleRedirect = (e: any, to: string) => {
    e.preventDefault();
    setIsLoading(true);
    return router.push(to);
  };
  const logOutHandler = async (e: any) => {
    setLogout(true);
    handleRedirect(e, '/');
    await signOut();
  };

  return (
    <>
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
                    <h3 className="font-Arimo text-[25px] font-bold uppercase text-black dark:text-white">ELearning</h3>
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
                    onClick={(e) => handleRedirect(e, '/profile')}
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
                title="Dashboard"
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
                title="Học viên"
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
                title="Thể loại"
                to="/admin/category/all"
                icon={<CategoryOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Lượt đăng ký"
                to="/admin/enrollment/all"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Bình luận"
                to="/admin/comment/all"
                icon={<FeedbackOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Đánh giá"
                to="/admin/review/all"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              {/* <Item
                title="Quản trị viên"
                to="/admin/team"
                icon={<ManageHistoryIcon />}
                selected={selected}
                setSelected={setSelected}
              /> */}
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

              {/* <Item
                            title="Thể loại"
                            to="/admin/Categories"
                            icon={<WysiwygIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        /> */}

              <Typography variant="h6" sx={{ m: '15px 0 5px 20px' }} className={styles.title_admin_sidebar}>
                {!isCollapsed && 'Thống kê'}
              </Typography>
              <Item
                title="Khoá học"
                to="/admin/analytics/courses"
                icon={<BarChartOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Lượt mua"
                to="/admin/analytics/enrollments"
                icon={<MapOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Học viên"
                to="/admin/analytics/users"
                icon={<ManageHistoryIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography variant="h5" sx={{ m: '15px 0 5px 20px' }} className={styles.title_admin_sidebar}>
                {!isCollapsed && 'Tuỳ chỉnh'}
              </Typography>
              {/* <Item
                            title="Trang chủ"
                            to="/admin/hero"
                            icon={<WebIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        /> */}
              <Item title="FAQ" to="/admin/faq" icon={<QuizIcon />} selected={selected} setSelected={setSelected} />
              <Typography variant="h6" sx={{ m: '15px 0 5px 20px' }} className={styles.title_admin_sidebar}>
                {/* {!isCollapsed && 'Mở rộng'} */}
              </Typography>
              {/* <Item
                            title="Cài đặt"
                            to="/admin/settings"
                            icon={<SettingsIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        /> */}
              <div onClick={logOutHandler}>
                <MenuItem icon={<ExitToAppIcon />} onClick={logOutHandler}>
                  <Typography className={`!font-Arimo !text-[1rem] font-semibold text-black dark:text-white`}>
                    Đăng xuất
                  </Typography>
                </MenuItem>
              </div>
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    </>
  );
};

export default AdminSidebar;
