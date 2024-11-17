'use client';

import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import { useLogoutQuery } from '../../../redux/features/auth/authApi';
import ProfileSidebar from './ProfileSidebar';
import ProfileDetails from './ProfileDetails';
import ChangePassword from './ChangePassword';
import { isAdminAuth } from '../../utils/isAdmin';

type Props = {
  user: any;
};

const Profile: React.FC<Props> = (props) => {
  const { user } = props;
  const [scroll, setScroll] = useState(false);
  const [active, setActive] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [logout, setLogout] = useState(false);
  const {} = useLogoutQuery(undefined, {
    skip: !logout ? true : false
  });
  const logOutHandler = async () => {
    setLogout(true);
    await signOut();
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }
  return (
    <div className="mx-auto flex w-[85%]">
      <div
        className={`${scroll ? 'top-[120px]' : 'top-[30px]'} sticky left-[30px] mb-[80px] mt-[80px] h-[450px] w-[60px] rounded-md border border-[#0000001b] bg-opacity-90 shadow-xl dark:border-[#ffffff1d] dark:bg-slate-900 dark:shadow-sm 800px:w-[310px]`}
      >
        <ProfileSidebar
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </div>
      <div className="mt-[80px] h-full w-full bg-transparent">
        {active === 1 && <ProfileDetails user={user} avatar={avatar} />}
        {active === 2 && <ChangePassword />}
      </div>
    </div>
  );
};

export default Profile;
