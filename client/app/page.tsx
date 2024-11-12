'use client';

import { useTheme } from 'next-themes';
import { FC, useEffect, useState } from 'react';
import Heading from '../components/public/Heading';
import Home from '../components/public/Home';
import Header from './components/header/Header';
import Courses from './components/home/Courses';
import Review from './components/home/Review';
import FAQ from './components/home/FAQ';

type Props = {};

const Page: FC<Props> = (props: Props) => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(0);
    const { theme } = useTheme();
    const [route, setRoute] = useState('Login');
    const [mounted, setMounted] = useState(false);

    // console.log(activeItem);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div
            className={`min-h-screen ${
                theme === 'light' ? 'bg-gradient-to-l from-blue-100 to-blue-200' : 'dark:bg-gray-900'
            }`}
        >
            <Heading
                title="ELearning"
                description="ELearning is a platform for learning."
                keywords="ELearning,Programming,MERN,Redux,Science"
            />
            <Header
                open={open}
                setOpen={setOpen}
                activeItem={activeItem}
                setRoute={setRoute}
                route={route}
                setActiveItem={setActiveItem}
            />
            <Home />
            <Courses />
            <Review />
            <FAQ />
        </div>
    );
};

export default Page;
