'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import avatarDefault from '../../../public/assets/avatar.png';
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiCoursera } from 'react-icons/si';
import { AiOutlineLogout } from 'react-icons/ai';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { isAdminAuth } from '../../utils/isAdmin';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Loading from '../../../components/common/Loading';

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logOutHandler: () => void;
};

const ProfileSidebar: React.FC<Props> = (props) => {
  const { user, active, setActive, avatar, logOutHandler } = props;
  const isAdmin = isAdminAuth(user);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleRedirectToAdmin = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    router.push('/admin');
  };
  return (
    <>
      {isLoading && <Loading />}
      <div className="w-full font-[500]">
        <div
          className={`${active === 1 ? 'bg-[#f7f9fa] dark:bg-slate-800' : 'bg-transparent'} flex w-full cursor-pointer items-center px-3 py-4`}
          onClick={() => setActive(1)}
        >
          <Image
            src={user?.avatar || avatar ? user?.avatar?.url || avatar : avatarDefault}
            alt="avatar"
            width={30}
            height={30}
            className="cursor-pointer rounded-full 800px:h-[30px] 800px:w-[30px]"
          />
          <h5 className="hidden pl-2 font-Arimo text-black dark:text-white 800px:block">Thông tin cá nhân</h5>
        </div>
        <div
          className={`${active === 2 ? 'bg-[#f7f9fa] dark:bg-slate-800' : 'bg-transparent'} flex w-full cursor-pointer items-center px-3 py-4`}
          onClick={() => setActive(2)}
        >
          <RiLockPasswordLine size={20} className="text-black dark:text-white" />
          <h5 className="hidden pl-2 font-Arimo text-black dark:text-white 800px:block">Thay đổi mật khẩu</h5>
        </div>
        <div
          className={`${active === 3 ? 'bg-[#f7f9fa] dark:bg-slate-800' : 'bg-transparent'} flex w-full cursor-pointer items-center px-3 py-4`}
          onClick={() => setActive(3)}
        >
          <SiCoursera size={20} className="text-black dark:text-white" />
          <h5 className="hidden pl-2 font-Arimo text-black dark:text-white 800px:block">Khóa học của tôi</h5>
        </div>
        {isAdmin && (
          <div
            className={`${active === 4 ? 'bg-[#f7f9fa] dark:bg-slate-800' : 'bg-transparent'}`}
            onClick={() => setActive(4)}
          >
            <Link
              className={`flex w-full cursor-pointer items-center px-3 py-4`}
              href={'/admin'}
              onClick={(e) => handleRedirectToAdmin(e)}
            >
              <MdOutlineAdminPanelSettings size={20} className="text-black dark:text-white" />
              <h5 className="hidden pl-2 font-Arimo text-black dark:text-white 800px:block">Trang quản trị</h5>
            </Link>
          </div>
        )}

        <div
          className={`${active === 4 ? 'dark:bg-slate-800' : 'bg-transparent'} flex w-full cursor-pointer items-center px-3 py-4`}
          onClick={() => logOutHandler()}
        >
          <AiOutlineLogout size={20} className="text-black dark:text-white" />
          <h5 className="hidden pl-2 font-Arimo text-black dark:text-white 800px:block">Đăng xuất</h5>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;
