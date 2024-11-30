'use client';

import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineLogout } from 'react-icons/ai';
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from 'react-icons/hi';
import { IoSearch } from 'react-icons/io5';
import { LiaUserCheckSolid } from 'react-icons/lia';
import { useSelector } from 'react-redux';
import Loading from '../../../components/common/Loading';
import CustomModal from '../../../components/modal/CustomModal';
import NavItems from '../../../components/navigation/NavItems';
import ThemeSwitcher from '../../../components/theme/ThemeSwitcher';
import avatar from '../../../public/assets/avatar.png';
import { useLoadUserQuery } from '../../../redux/features/api/apiSlice';
import { useLogoutQuery, useSocialLoginMutation } from '../../../redux/features/auth/authApi';
import Login from '../auth/Login';
import SignUp from '../auth/SignUp';
import Verification from '../auth/Verification';
type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  setActiveItem?: (activeItem: number) => void;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = (props) => {
  const { activeItem, open, setOpen, route, setRoute, setActiveItem } = props;
  const { user, isLoggedIn } = useSelector((state: any) => state.auth);
  const { data } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPopupProfile, setIsShowPopupProfile] = useState(false);
  const { isLoading: loadingProfile } = useLoadUserQuery(
    {},
    {
      refetchOnMountOrArgChange: true
    }
  );
  const [socialLogin, { isSuccess, error }] = useSocialLoginMutation();
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [search, setSearch] = useState('');
  const [logout, setLogout] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/profile') return;
    setIsLoading(true);
    router.push('/profile');
  };
  const {} = useLogoutQuery(undefined, {
    skip: !logout
  });

  const logOutHandler = async () => {
    setLogout(true);
    await signOut();
    router.push('/');
    setIsShowPopupProfile(false);
  };

  useEffect(() => {
    if (data && !isLoggedIn) {
      socialLogin({
        email: data?.user?.email,
        name: data?.user?.name,
        avatar: data?.user?.image
      });
    }

    if (isSuccess && data === null && isLoggedIn) {
      toast.success('Đăng nhập thành công', {
        duration: 2000
      });
    }
    if (error) {
      toast.error('Đăng nhập thất bại', {
        duration: 2000
      });
    }
    if (!data && !user && !isLoggedIn) {
      setLogout(true);
    } else {
      setLogout(false);
    }
  }, [data, user, isSuccess, error, isLoggedIn, socialLogin]);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  const handleClose = (e: any) => {
    if (e.target.id === 'screen') {
      setOpenSidebar(false);
    }
  };

  const handleSearch = () => {
    if (search.trim() === '') {
      router.push('/course');
    } else {
      router.push(`/course?keyword=${search}`);
    }
  };

  return (
    <div className={`text-lightText relative w-full shadow-md dark:bg-gray-900 dark:text-white`}>
      <div
        className={`${
          active
            ? 'fixed left-0 top-0 z-[80] h-[80px] w-full border-b bg-white shadow-xl dark:border-[#ffffff1c] dark:bg-slate-950'
            : 'z-[80] h-[80px] w-full border-b dark:border-[#ffffff1c] dark:shadow'
        }`}
      >
        <div className="m-auto h-full w-[95%] py-2 800px:w-[92%]">
          <div className="flex h-[80px] w-full items-center justify-between p-3">
            <div>
              <Link href={'/'} className={`font-Arimo text-[25px] font-bold text-lightTextPrimary dark:text-white`}>
                <span className="text-[#2190ff] dark:text-[#2190ff]">E</span>
                demy
              </Link>
            </div>
            {/* search input */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm khóa học"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className="h-[40px] w-[300px] rounded-md border border-[#0000001f] px-2 text-black dark:border-[#ffffff1d] dark:bg-[#ffffff1d] dark:text-white"
              />
              <IoSearch
                size={20}
                className="absolute right-4 top-2 text-black dark:text-white"
                onClick={() => handleSearch()}
              />
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
            </div>
            <div className="flex items-center">
              <ThemeSwitcher />
              {/* only for mobile */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={30}
                  className="cursor-pointer text-black dark:text-white"
                  onClick={() => setOpenSidebar(!openSidebar)}
                />
              </div>
              {/* {loadingProfile && <Loading />} */}
              {isLoading && <Loading />}
              {user ? (
                <>
                  <Image
                    src={user.avatar ? user?.avatar?.url : avatar}
                    width={30}
                    height={30}
                    alt="avatar"
                    className="relative cursor-pointer rounded-full"
                    style={{
                      border: activeItem === 5 ? '2px solid #fff' : 'none'
                    }}
                    onClick={() => setIsShowPopupProfile(!isShowPopupProfile)}
                  />
                </>
              ) : (
                <HiOutlineUserCircle
                  size={30}
                  className="hidden cursor-pointer text-black dark:text-white 800px:block"
                  onClick={() => {
                    setRoute('Login');
                    setOpen(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>
        {isShowPopupProfile && (
          <div className="absolute right-0 top-[70px] z-[100] flex w-[200px] flex-col gap-4 rounded-md border bg-white py-4 text-black shadow-md dark:bg-slate-900 dark:shadow-lg">
            <Link
              href={`/profile`}
              // onClick={() => setActiveItem(5)}
              onClick={handleProfileClick}
              title={`${user?.email} - ${user?.name}`}
              className={`flex w-full cursor-pointer items-center gap-4 px-2`}
            >
              <LiaUserCheckSolid size={20} className="text-black dark:text-white" />
              <h5 className="pl-2 font-Arimo text-black hover:text-[#000000b3] hover:underline dark:text-white 800px:block">
                Trang cá nhân
              </h5>
            </Link>
            <div className={`flex w-full cursor-pointer items-center gap-4 px-2`} onClick={() => logOutHandler()}>
              <AiOutlineLogout size={20} className="text-black dark:text-white" />
              <h5 className="pl-2 font-Arimo text-black hover:text-[#000000b3] hover:underline dark:text-white 800px:block">
                Đăng xuất
              </h5>
            </div>
          </div>
        )}
        {/* mbile sidebar */}
        {openSidebar && (
          <div
            className="fixed left-0 top-0 z-[99999] h-screen w-full bg-[#00000024] dark:bg-[unset]"
            onClick={handleClose}
            id="screen"
          >
            <div className="fixed right-0 top-0 z-[999999] h-screen w-[70%] bg-white dark:bg-slate-900 dark:bg-opacity-90">
              <NavItems activeItem={activeItem} isMobile={true} />
              <HiOutlineUserCircle
                size={25}
                className="my-2 ml-5 cursor-pointer text-black dark:text-white"
                onClick={() => {
                  setOpen(true);
                  setOpenSidebar(false);
                }}
              />
              <br />
              <br />
              Copyright &copy; 2024 ELearning
            </div>
          </div>
        )}
      </div>
      {route === 'Login' && (
        <>
          {open && (
            <CustomModal open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} component={Login} />
          )}
        </>
      )}
      {route === 'Signup' && (
        <>
          {open && (
            <CustomModal open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} component={SignUp} />
          )}
        </>
      )}
      {route === 'Verification' && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
