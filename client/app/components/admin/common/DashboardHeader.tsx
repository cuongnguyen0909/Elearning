import React, { FC, useState } from 'react';
import ThemeSwitcher from '../../../../components/theme/ThemeSwitcher';
import { IoMdNotificationsOutline } from 'react-icons/io';
interface DashboardHeaderProps {
    open?: boolean;
    setOpen?: any;
}

const DashboardHeader: FC<DashboardHeaderProps> = (props) => {
    const { open, setOpen } = props;
    return (
        <div className="fixed right-0 top-5 z-20 flex w-full items-center justify-end p-6">
            <ThemeSwitcher />
            <div className="relative m-2 cursor-pointer" onClick={() => setOpen(!open)}>
                <IoMdNotificationsOutline className="cursor-pointer text-2xl text-black dark:text-white" />
                <span className="absolute -right-2 -top-2 flex w-[20px] items-center justify-center rounded-full bg-[#3ccba0] text-[12px] text-white">
                    3
                </span>
            </div>
            {open && (
                <div className="absolute top-16 z-10 h-[50vh] w-[350px] rounded bg-white shadow-xl dark:bg-[#111C43]">
                    <h5 className="text-center font-Poppins text-[20px] text-black dark:text-white">Notifications</h5>
                    <div className="border-b border-b-[#000000f] bg-[#00000013] font-Poppins dark:border-[#ffffff47] dark:bg-[#2d3a4ea1]">
                        <div className="flex w-full items-center justify-between p-2">
                            <p className="text-black dark:text-white">New Question Received</p>
                            <p className="cursor-pointer text-black dark:text-white">Mark as read</p>
                        </div>
                        <p className="px-2 text-black dark:text-white">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae fugiat officiis ipsam
                            aliquam, quis mollitia optio dolor libero voluptatum nulla.
                        </p>
                        <p className="p-2 text-[14px] text-black dark:text-white">5 days ago</p>
                    </div>
                    <div className="border-b border-b-[#000000f] bg-[#00000013] font-Poppins dark:border-[#ffffff47] dark:bg-[#2d3a4ea1]">
                        <div className="flex w-full items-center justify-between p-2">
                            <p className="text-black dark:text-white">New Question Received</p>
                            <p className="cursor-pointer text-black dark:text-white">Mark as read</p>
                        </div>
                        <p className="px-2 text-black dark:text-white">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae fugiat officiis ipsam
                            aliquam, quis mollitia optio dolor libero voluptatum nulla.
                        </p>
                        <p className="p-2 text-[14px] text-black dark:text-white">5 days ago</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHeader;
