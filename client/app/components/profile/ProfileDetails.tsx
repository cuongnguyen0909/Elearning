import Image from 'next/image';
import React, { useState } from 'react';
import defaultAvatar from '../../../public/assets/avatar.png';
import { AiOutlineCamera } from 'react-icons/ai';
import { styles } from '../../utils/style';
type Props = {
    user: any;
    avatar: any;
};

const ProfileDetails: React.FC<Props> = (props) => {
    const { user, avatar } = props;
    const [name, setName] = useState(user && user?.name);

    const imageHandler = async (e: any) => {};
    const handleSubmit = async (e: any) => {};
    return (
        <div className="flex w-full flex-col items-center justify-center">
            <div className="relative">
                <Image
                    width={120}
                    height={120}
                    src={
                        user?.avatar || avatar
                            ? user?.avatar?.url || avatar
                            : defaultAvatar
                    }
                    alt="avatar"
                    className="cursor-pointer rounded-full border-[3px] border-[#37a39a] shadow-xl dark:border-[#ffffff1d] dark:shadow-sm"
                />
                <input
                    type="file"
                    name=""
                    id="avatar"
                    className="hidden"
                    onChange={imageHandler}
                    accept="image/*"
                    size={1000000}
                />
                <label htmlFor="avatar">
                    <div className="absolute bottom-2 right-2 flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full bg-slate-900">
                        <AiOutlineCamera
                            size={20}
                            fill="#fff"
                            className="text-[#dac9c9] dark:text-white"
                        />
                    </div>
                </label>
            </div>
            <br />
            <div className="w-full">
                <form onSubmit={handleSubmit}>
                    <div className="m-auto block border-[#00000027] bg-[#e8f6ffad] pb-4 pl-6 pt-2 shadow-xl dark:border-[#ffffff1d] dark:bg-slate-900 dark:shadow-sm 800px:w-[50%]">
                        <div className="w-[100%]">
                            <label
                                htmlFor=""
                                className="block pb-2 font-Poppins text-black dark:text-white"
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                className={`${styles.input} mb-4 !w-[95%] border-[#00000027] bg-[#d1e9fb] font-Poppins dark:border-[#ffffff1d] dark:bg-slate-800 800px:mb-0`}
                                required
                                value={name}
                            />
                        </div>
                        <div className="w-[100%] pt-2">
                            <label
                                htmlFor=""
                                className="block pb-2 font-Poppins text-black dark:text-white"
                            >
                                Email Address
                            </label>
                            <input
                                type="text"
                                readOnly
                                className={`${styles.input} mb-1 !w-[95%] border-[#00000027] bg-[#d1e9fb] font-Poppins text-black dark:border-[#ffffff1d] dark:bg-slate-800 dark:text-white 800px:mb-0`}
                                required
                                value={user?.email}
                            />
                        </div>
                        <input
                            type="submit"
                            className={`mt-8 h-[40px] w-full cursor-pointer rounded-[3px] border border-[#00000027] bg-[#d1e9fb] text-center font-Poppins text-black dark:border-[#ffffff1d] dark:bg-slate-800 dark:text-white 800px:w-[250px]`}
                            required
                            value={'Update Profile'}
                        />
                    </div>
                </form>
                <br />
            </div>
        </div>
    );
};

export default ProfileDetails;
