import React, { useEffect, useState } from 'react';
import { styles } from '../../utils/style';
import toast from 'react-hot-toast';
import { useUpdatePasswordMutation } from '../../../redux/features/profile/profileApi';
import Loading from '../../../components/common/Loading';

interface Props {}

const ChangePassword: React.FC<Props> = (props) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [
        updatePassword,
        {
            isSuccess: isChangePasswordSuccess,
            error: changePasswordError,
            isLoading: isChangePasswordLoading,
            data: changePasswordData
        }
    ] = useUpdatePasswordMutation();
    const [confirmPassword, setConfirmPassword] = useState('');
    const passwordChangeHandler = async (e: any) => {
        e.preventDefault();
        if (
            currentPassword === '' ||
            newPassword === '' ||
            confirmPassword === ''
        ) {
            toast.error('Please fill all the fields');
        }

        if (newPassword !== confirmPassword) {
            toast.error('Password does not match');
        } else {
            await updatePassword({ currentPassword, newPassword });
        }
    };

    useEffect(() => {
        if (isChangePasswordSuccess) {
            toast.success('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }

        if (changePasswordError) {
            if ('data' in changePasswordError) {
                const error = changePasswordError as any;
                toast.error(error?.data.message);
            }
        }
    }, [isChangePasswordSuccess, changePasswordError]);
    return (
        <>
            {isChangePasswordLoading && <Loading />}
            <div className="flex w-full flex-col items-center justify-center px-2 pl-7 font-Poppins text-black dark:text-white 800px:px-5 800px:pl-0">
                <h1 className="block pb-2 text-center text-[25px] font-semibold 800px:text-[30px]">
                    Change Password
                </h1>
                <div className="w-full">
                    <form
                        className="flex flex-col items-center"
                        aria-required
                        onSubmit={passwordChangeHandler}
                    >
                        <div className="mt-5 w-[100%] 800px:w-[60%]">
                            <label
                                htmlFor=""
                                className="block pb-2 font-semibold"
                            >
                                Enter Current Password
                            </label>
                            <input
                                type="password"
                                className={`${styles.input} mb-4 !w-[95%] border-[#00000027] bg-[#ffffff3d] dark:border-[#ffffff1d] dark:bg-slate-800 800px:mb-0`}
                                required
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                            />
                        </div>
                        <div className="mt-2 w-[100%] 800px:w-[60%]">
                            <label
                                htmlFor=""
                                className="block pb-2 font-semibold"
                            >
                                Enter New Password
                            </label>
                            <input
                                type="password"
                                className={`${styles.input} mb-4 !w-[95%] border-[#00000027] bg-[#ffffff3d] dark:border-[#ffffff1d] dark:bg-slate-800 800px:mb-0`}
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="mt-2 w-[100%] 800px:w-[60%]">
                            <label
                                htmlFor=""
                                className="block pb-2 font-semibold"
                            >
                                Enter Confirm Password
                            </label>
                            <input
                                type="password"
                                className={`${styles.input} mb-4 !w-[95%] border-[#00000027] bg-[#ffffff3d] dark:border-[#ffffff1d] dark:bg-slate-800 800px:mb-0`}
                                required
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>
                        <div className="mt-2 w-[100%] 800px:w-[60%]">
                            <input
                                className="mb-5 mt-8 h-[40px] !w-[95%] cursor-pointer rounded-[3px] border border-[#00000027] bg-[#224c8a16] text-center font-semibold dark:border-[#ffffff1d] dark:bg-slate-900"
                                type="submit"
                                required
                                value="Update"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;
