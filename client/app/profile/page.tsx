'use client';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import Heading from '../../components/public/Heading';
import Header from '../components/header/Header';
import Protected from '../hooks/useProtected';
import Profile from '../components/profile/Profile';
import { useSelector } from 'react-redux';

type Props = {};

const page: React.FC<Props> = (props) => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(0);
    const { theme } = useTheme();
    const [route, setRoute] = useState('Login');
    const [mounted, setMounted] = useState(false);
    const { user } = useSelector((state: any) => state.auth);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return (
        <div>
            <Protected>
                <div
                    className={`min-h-screen ${
                        theme === 'light'
                            ? 'bg-gradient-to-l from-blue-100 to-blue-200'
                            : 'dark:bg-gray-900'
                    }`}
                >
                    <Heading
                        title={`${user?.name} Profile`}
                        description="ELearning is a platform for learning."
                        keywords="ELearning,Programming,MERN,Redux,Science"
                    />
                    <Header
                        open={open}
                        setOpen={setOpen}
                        activeItem={activeItem}
                        setRoute={setRoute}
                        route={route}
                    />
                    <Profile user={user} />
                </div>
            </Protected>
        </div>
    );
};

export default page;
