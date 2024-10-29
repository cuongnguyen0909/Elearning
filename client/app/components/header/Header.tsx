'use client';

import Link from 'next/link';
import React, { FC, useState } from 'react';
import NavItems from '../../../components/navigation/NavItems';
import ThemeSwitcher from '../../../components/theme/ThemeSwitcher';
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from 'react-icons/hi';
import { useTheme } from 'next-themes';
import CustomModal from '../../../components/modal/CustomModal';
import Login from '../auth/Login';
import SignUp from '../auth/SignUp';
import Verification from '../auth/Verification';

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
    route: string;
    setRoute: (route: string) => void;
};

const Header: FC<Props> = (props) => {
    const { activeItem, open, setOpen, route, setRoute } = props;
    const [active, setActive] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
    const { theme } = useTheme();

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

    return (
        <div
            className={`relative w-full ${
                theme === 'light'
                    ? 'bg-[rgba(232,246,255,0.68)] text-lightText'
                    : 'dark:bg-gray-900 dark:text-white'
            }`}
        >
            <div
                className={`${
                    active
                        ? 'fixed left-0 top-0 z-[80] h-[80px] w-full border-b shadow-xl transition duration-500 dark:border-[#ffffff1c] dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black'
                        : 'z-[80] h-[80px] w-full border-b dark:border-[#ffffff1c] dark:shadow'
                }`}
            >
                <div className="m-auto h-full w-[95%] py-2 800px:w-[92%]">
                    <div className="flex h-[80px] w-full items-center justify-between p-3">
                        <div>
                            <Link
                                href={'/'}
                                className={`font-Poppins text-[25px] font-[500] text-black dark:text-white`}
                            >
                                ELearning
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <NavItems
                                activeItem={activeItem}
                                isMobile={false}
                            />
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
                            <HiOutlineUserCircle
                                size={30}
                                className="hidden cursor-pointer text-black dark:text-white 800px:block"
                                onClick={() => {
                                    setRoute('Login');
                                    setOpen(true);
                                }}
                            />
                        </div>
                    </div>
                </div>
                {/* mbile sidebar */}
                {openSidebar && (
                    <div
                        className="fixed left-0 top-0 z-[99999] h-screen w-full bg-[#00000024] dark:bg-[unset]"
                        onClick={handleClose}
                        id="screen"
                    >
                        <div className="fixed right-0 top-0 z-[999999999] h-screen w-[70%] bg-white dark:bg-slate-900 dark:bg-opacity-90">
                            <NavItems activeItem={activeItem} isMobile={true} />
                            <HiOutlineUserCircle
                                size={25}
                                className="my-2 ml-5 cursor-pointer text-black dark:text-white"
                                onClick={() => setOpen(true)}
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
                        <CustomModal
                            open={open}
                            setOpen={setOpen}
                            setRoute={setRoute}
                            activeItem={activeItem}
                            component={Login}
                        />
                    )}
                </>
            )}
            {route === 'Signup' && (
                <>
                    {open && (
                        <CustomModal
                            open={open}
                            setOpen={setOpen}
                            setRoute={setRoute}
                            activeItem={activeItem}
                            component={SignUp}
                        />
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
