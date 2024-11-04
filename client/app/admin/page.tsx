'use client';
import { useTheme } from 'next-themes';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Heading from '../../components/public/Heading';
import AdminSidebar from '../components/admin/sidebar/AdminSidebar';
import DashboardHero from '../components/admin/common/DashboardHero';
import AdminProtected from '../hooks/adminProtected';
interface IPageProps {}

const page: FC<IPageProps> = (props) => {
    const [open, setOpen] = useState(false);
    const { theme } = useTheme();
    const [route, setRoute] = useState('Login');
    const [mounted, setMounted] = useState(false);
    const { user } = useSelector((state: any) => state.auth);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return (
        <AdminProtected>
            <div
                className={`min-h-screen ${
                    theme === 'light'
                        ? 'bg-gradient-to-l from-blue-100 to-blue-200'
                        : 'dark:bg-gray-900'
                }`}
            >
                <Heading
                    title={`${user?.name} Admin`}
                    description="ELearning is a platform for learning."
                    keywords="ELearning,Programming,MERN,Redux,Science"
                />
                <div className="flex h-[200vh]">
                    <div className="w-1/5 1500px:w-[16%]">
                        <AdminSidebar />
                    </div>
                    <div className="w-[85%]">
                        <DashboardHero />
                    </div>
                </div>
            </div>
        </AdminProtected>
    );
};

export default page;
