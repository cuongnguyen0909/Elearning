import Image from 'next/image';
import React from 'react';
import avatarDefault from '../../../public/assets/avatar.png';
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiCoursera } from 'react-icons/si';
import { AiOutlineLogout } from 'react-icons/ai';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { isAdminAuth } from '../../utils/isAdmin';
import Link from 'next/link';

type Props = {
    user: any;
    active: number;
    avatar: string | null;
    setActive: (active: number) => void;
    logOutHandler: () => void;
};

const SidebarProfile: React.FC<Props> = (props) => {
    const { user, active, setActive, avatar, logOutHandler } = props;
    const isAdmin = isAdminAuth(user);
    return (
        <div className="w-full">
            <div
                className={`${active === 1 ? 'bg-[#d7ebfa] dark:bg-slate-800' : 'bg-transparent'} flex w-full cursor-pointer items-center px-3 py-4`}
                onClick={() => setActive(1)}
            >
                <Image
                    src={
                        user?.avatar || avatar
                            ? user?.avatar?.url || avatar
                            : avatarDefault
                    }
                    alt="avatar"
                    width={30}
                    height={30}
                    className="cursor-pointer rounded-full 800px:h-[30px] 800px:w-[30px]"
                />
                <h5 className="hidden pl-2 font-Poppins text-black dark:text-white 800px:block">
                    My Account
                </h5>
            </div>
            <div
                className={`${active === 2 ? 'bg-[#d7ebfa] dark:bg-slate-800' : 'bg-transparent'} flex w-full cursor-pointer items-center px-3 py-4`}
                onClick={() => setActive(2)}
            >
                <RiLockPasswordLine
                    size={20}
                    className="text-black dark:text-white"
                />
                <h5 className="hidden pl-2 font-Poppins text-black dark:text-white 800px:block">
                    Change Password
                </h5>
            </div>
            <div
                className={`${active === 3 ? 'bg-[#d7ebfa] dark:bg-slate-800' : 'bg-transparent'} flex w-full cursor-pointer items-center px-3 py-4`}
                onClick={() => setActive(3)}
            >
                <SiCoursera size={20} className="text-black dark:text-white" />
                <h5 className="hidden pl-2 font-Poppins text-black dark:text-white 800px:block">
                    Enrolled Courses
                </h5>
            </div>
            {isAdmin && (
                <Link
                    className={`flex w-full cursor-pointer items-center px-3 py-4`}
                    href={'/admin'}
                >
                    <MdOutlineAdminPanelSettings
                        size={20}
                        className="text-black dark:text-white"
                    />
                    <h5 className="hidden pl-2 font-Poppins text-black dark:text-white 800px:block">
                        Admin Dashboard
                    </h5>
                </Link>
            )}

            <div
                className={`${active === 4 ? 'bg-[#d7ebfa] dark:bg-slate-800' : 'bg-transparent'} flex w-full cursor-pointer items-center px-3 py-4`}
                onClick={() => logOutHandler()}
            >
                <AiOutlineLogout
                    size={20}
                    className="text-black dark:text-white"
                />
                <h5 className="hidden pl-2 font-Poppins text-black dark:text-white 800px:block">
                    Logout
                </h5>
            </div>
        </div>
    );
};

export default SidebarProfile;
