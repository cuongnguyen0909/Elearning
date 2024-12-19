import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineCamera } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import Loading from '../../../components/common/Loading';
import defaultAvatar from '../../../public/assets/avatar.png';
import { useLoadUserQuery } from '../../../redux/features/api/apiSlice';
import { useUpdateAvatarMutation, useUpdateProfileMutation } from '../../../redux/features/profile/profileApi';
import { styles } from '../../utils/style';
type Props = {
  user: any;
  avatar: any;
};

const ProfileDetails: React.FC<Props> = (props) => {
  const { user, avatar } = props;
  const [name, setName] = useState(user && user?.name);
  const { isLoggedIn, token } = useSelector((state: any) => state.auth);
  const [loadUser, setLoadUser] = useState(false);
  const [updateAvatar, { isSuccess, isLoading, error }] = useUpdateAvatarMutation();
  const [updateProfile, { isSuccess: isProfileSuccess, isLoading: isProfileLoading, error: profileError }] =
    useUpdateProfileMutation();
  const { refetch, isUninitialized, isFetching } = useLoadUserQuery(undefined, {
    skip: !loadUser
  });
  const refetchTeam = useCallback(() => {
    if (!isUninitialized) {
      refetch();
    }
  }, [isUninitialized, refetch]);
  const imageHandler = async (e: any) => {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const avatar = fileReader.result;
      const size = e.target.files[0].size;
      if (size > 1100000) {
        toast.error('Kích thước ảnh quá lớn. Vui lòng chọn ảnh khác nhỏ hơn 1MB');
        return;
      }
      if (fileReader.readyState === 2) {
        await updateAvatar(avatar);
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (isSuccess) {
      refetchTeam();
      setLoadUser(true);
      toast.success('Cập nhật ảnh đại diện thành công');
      // refetch();
    }
    if (error) {
      toast.error(`Cập nhật ảnh đại diện thất bại`);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (isProfileSuccess) {
      setName(user?.name);
      toast.success('Cập nhật thông tin thành công', {
        duration: 2000
      });
      setLoadUser(true);
    }
    if (profileError) {
      toast.error('Cập nhật thông tin thất bại', {
        duration: 2000
      });
    }
  }, [isProfileSuccess, profileError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name !== '' && name !== user?.name) {
      await updateProfile({
        name
      });
    }
  };
  return (
    <>
      {(isLoading || isFetching || isProfileLoading) && <Loading />}
      <div className="flex w-full flex-col items-center justify-center px-2 pb-[200px] pl-7 800px:px-5 800px:pl-0">
        <div className="relative">
          <Image
            key={user?.avatar?.url || avatar}
            width={120}
            height={120}
            src={user?.avatar || avatar ? user?.avatar?.url || avatar : defaultAvatar}
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

            // size={1000000}
          />
          <label htmlFor="avatar">
            <div className="absolute bottom-2 right-2 flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full bg-slate-900">
              <AiOutlineCamera
                size={20}
                fill="#fff"
                className="text-[#dac9c9] dark:text-white"
                title="Chọn ảnh đại diện"
              />
            </div>
          </label>
        </div>
        <br />
        <div className="w-full text-black dark:text-white">
          <form onSubmit={handleSubmit}>
            <div className="m-auto block w-full pb-4 pl-6 pt-2 font-Arimo 800px:w-[50%]">
              <div className="w-[100%]">
                <label htmlFor="" className="block pb-2 font-semibold">
                  Tên
                </label>
                <input
                  type="text"
                  className={`${styles.input} mb-4 border-[#00000027] bg-[#ffffff3d] shadow-md dark:border-[#ffffff1d] dark:bg-slate-800 800px:mb-0`}
                  required
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
              <div className="w-[100%] pt-2">
                <label htmlFor="" className="block pb-2 font-semibold">
                  Email
                </label>
                <input
                  type="text"
                  readOnly
                  className={`${styles.input} mb-1 border-[#00000027] bg-[#ffffff3d] text-black shadow-md dark:border-[#4027271d] dark:bg-slate-800 800px:mb-0`}
                  required
                  value={user?.email}
                />
              </div>
              <div className="w-[100%]">
                <input
                  type="submit"
                  className={`mt-8 h-[40px] !w-[100%] cursor-pointer rounded-[3px] border border-[#00000027] bg-[#224c8a16] text-center font-semibold shadow-md dark:border-[#ffffff1d] dark:!bg-[#00000015] 800px:w-[250px]`}
                  required
                  value="Cập nhật thông tin"
                />
              </div>
            </div>
          </form>
          <br />
        </div>
      </div>
    </>
  );
};

export default ProfileDetails;
