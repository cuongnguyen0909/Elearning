import React, { useState } from 'react';
import { styles } from '../../utils/style';

interface Props {}

const ChangePassword: React.FC<Props> = (props) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const passwordChangeHandler = (e: any) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Password does not match');
            return;
        }
        console;
    };
    return (
        <div className="w-full px-2 pl-7 font-Poppins text-black dark:text-white 800px:px-5 800px:pl-0">
            <h1 className="block pb-2 text-center text-[25px] font-[500] 800px:text-[30px]">
                Change Password
            </h1>
            <div className="w-full">
                <form
                    className="flex flex-col items-center"
                    aria-required
                    onSubmit={passwordChangeHandler}
                >
                    <div className="mt-5 w-[100%] 800px:w-[60%]">
                        <label htmlFor="" className="block pb-2">
                            Enter Old Password
                        </label>
                        <input
                            type="password"
                            className={`${styles.input} mb-4 !w-[95%] border-[#00000027] bg-[#d1e9fb] dark:border-[#ffffff1d] dark:bg-slate-800 800px:mb-0`}
                            required
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="mt-2 w-[100%] 800px:w-[60%]">
                        <label htmlFor="" className="block pb-2">
                            Enter New Password
                        </label>
                        <input
                            type="password"
                            className={`${styles.input} mb-4 !w-[95%] border-[#00000027] bg-[#d1e9fb] dark:border-[#ffffff1d] dark:bg-slate-800 800px:mb-0`}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="mt-2 w-[100%] 800px:w-[60%]">
                        <label htmlFor="" className="block pb-2">
                            Enter Confirm Password
                        </label>
                        <input
                            type="password"
                            className={`${styles.input} mb-4 !w-[95%] border-[#00000027] bg-[#d1e9fb] dark:border-[#ffffff1d] dark:bg-slate-800 800px:mb-0`}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="mt-2 w-[100%] 800px:w-[60%]">
                        <input
                            className="mb-5 mt-8 h-[40px] !w-[95%] cursor-pointer rounded-[3px] border border-[#00000027] bg-[#d1e9fb] text-center dark:border-[#ffffff1d] dark:bg-slate-800"
                            type="submit"
                            required
                            value="Update"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
