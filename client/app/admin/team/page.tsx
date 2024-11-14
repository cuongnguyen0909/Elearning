'use client';
import { useTheme } from 'next-themes';
import React, { FC, useEffect } from 'react';
import AdminProtected from '../../hooks/adminProtected';
import Heading from '../../../components/public/Heading';
import AdminSidebar from '../../components/admin/sidebar/AdminSidebar';
import DashboardHero from '../../components/admin/common/DashboardHero';
import AllUsers from '../../components/admin/user/all/AllUsers';
interface IPageProps {}
const page: FC<IPageProps> = (props) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <AdminProtected>
      <div className={`'dark:bg-gray-900 min-h-screen`}>
        <Heading title="All Course" description="All courses" keywords="All,Course,ELearning" />
        <div className="flex h-screen">
          <div className="w-1/5 1500px:w-[16%]">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero isDashboard={false} />
            <AllUsers isTeam={true} />
          </div>
        </div>
      </div>
    </AdminProtected>
  );
};

export default page;
