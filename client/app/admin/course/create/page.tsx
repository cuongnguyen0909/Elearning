'use client';
import React, { FC, useEffect } from 'react';
import AdminSidebar from '../../../components/admin/sidebar/AdminSidebar';
import Heading from '../../../../components/public/Heading';
import DashboardHero from '../../../components/admin/common/DashboardHero';
import { useTheme } from 'next-themes';
import CreateCourse from '../../../components/admin/course/CreateCourse';

interface IPageProps {}

const page: FC<IPageProps> = (props) => {
    const [active, setActive] = React.useState(0);
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return (
        <div
            className={`min-h-screen ${
                theme === 'light'
                    ? 'bg-gradient-to-l from-blue-100 to-blue-200'
                    : 'dark:bg-gray-900'
            }`}
        >
            <Heading
                title="Create Course"
                description="Create a new course"
                keywords="Create,Course,ELearning"
            />
            <div className="flex">
                <div className="w-1/5 1500px:w-[16%]">
                    <AdminSidebar />
                </div>
                <div className="w-[85%]">
                    <DashboardHero />
                    <CreateCourse />
                </div>
            </div>
        </div>
    );
};

export default page;
