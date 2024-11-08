import Link from 'next/link';
import React, { FC } from 'react';

type Props = {
    activeItem: number;
    isMobile: boolean;
};

export const navItemsData = [
    {
        name: 'Trang chủ',
        url: '/'
    },
    {
        name: 'Khóa học',
        url: '/courses'
    },
    {
        name: 'Về chúng tôi',
        url: '/about'
    },
    {
        name: 'Chính sách',
        url: '/policy'
    },
    {
        name: 'FAQ',
        url: '/faq'
    }
];

const NavItems: FC<Props> = (props) => {
    const { activeItem, isMobile } = props;
    return (
        <>
            <div className="hidden 800px:flex">
                {navItemsData &&
                    navItemsData.map((item, index) => (
                        <Link href={`${item?.url}`} key={index} passHref>
                            <span
                                className={`${
                                    activeItem === index
                                        ? 'text-[#37b668] dark:text-[#37a39a]'
                                        : 'text-black dark:text-white'
                                } px-6 font-Poppins text-[18px] font-[400]`}
                            >
                                {item?.name}
                            </span>
                        </Link>
                    ))}
            </div>
            {isMobile && (
                <div className="mt-5 800px:hidden">
                    <div className="w-full py-6 text-center">
                        <Link href={'/'} passHref>
                            <span className="font-Poppins text-[25px] font-bold">
                                <span className="dark:text-[#37b668]">E</span>Learning
                            </span>
                        </Link>
                    </div>
                    {navItemsData &&
                        navItemsData.map((item, index) => (
                            <Link href="/" passHref>
                                <span
                                    className={`${
                                        activeItem === index
                                            ? 'text-[crimson] dark:text-[#37a39a]'
                                            : 'text-black dark:text-white'
                                    } block px-6 py-5 font-Poppins text-[18px] font-[400]`}
                                >
                                    {item?.name}
                                </span>
                            </Link>
                        ))}
                </div>
            )}
        </>
    );
};

export default NavItems;
