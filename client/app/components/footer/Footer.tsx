import Link from 'next/link';
import React, { FC } from 'react';
import { BsLink45Deg } from 'react-icons/bs';
import CustomModal from '../../../components/modal/CustomModal';
import SignUp from '../auth/SignUp';
import { useSelector } from 'react-redux';

interface FooterProps {
    route: string;
    setRoute: (route: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const Footer: FC<FooterProps> = (props) => {
    const { route, setRoute, open, setOpen } = props;
    const { isLoggedIn } = useSelector((state: any) => state.auth);
    console.log(route, open);
    return (
        <footer className="pb-10">
            <div className="border border-[#0000000e] dark:border-[#ffffff1e]" />
            <br />
            <div className="mx-auto w-[95%] px-2 sm:px-6 800px:w-full 800px:max-w-[85%] lg:px-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                    <div className="space-y-3">
                        <h3 className="text-[20px] font-[600] text-black dark:text-white">Về chúng tôi</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    href={'/about'}
                                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                                >
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={'/privacy-policy'}
                                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                                >
                                    Chính sách bảo mật
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-[20px] font-[600] text-black dark:text-white">Truy cập nhanh</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    href={'/course'}
                                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                                >
                                    Khóa học của chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={'/faq'}
                                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                                >
                                    FAQ
                                </Link>
                            </li>
                            {!isLoggedIn && (
                                <li>
                                    <span
                                        className="cursor-pointer text-base text-black dark:text-gray-300 dark:hover:text-white"
                                        onClick={() => {
                                            setRoute && setRoute('Signup');
                                            setOpen && setOpen(true);
                                        }}
                                    >
                                        Đăng ký ngay
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-[20px] font-[600] text-black dark:text-white">Nền tảng xã hội</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    href={'https://www.facebook.com/'}
                                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                                >
                                    Facebook
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={'https://github.com/cuongnguyen0909'}
                                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                                >
                                    Github
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="pb-3 text-[20px] font-[600] text-black dark:text-white">
                            Liên hệ với chúng tôi
                        </h3>
                        <p className="pb-2 text-base text-black dark:text-gray-300 dark:hover:text-white">
                            Địa chỉ: 180 Cao Lỗ, Phường 4, Quận 8, TP.HCM
                        </p>
                        {/* email */}
                        <p className="pb-2 text-base text-black dark:text-gray-300 dark:hover:text-white">
                            Email: edemy@edu.com
                        </p>

                        {/* copyright */}
                        <p className="text-base text-black dark:text-gray-300 dark:hover:text-white">
                            © 2021 Edemy. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
            {route === 'Signup' && (
                <>
                    {open && setOpen && (
                        <CustomModal open={open} setOpen={setOpen} setRoute={setRoute} component={SignUp} />
                    )}
                </>
            )}
        </footer>
    );
};

export default Footer;
