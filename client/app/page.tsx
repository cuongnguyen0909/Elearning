'use client';

import { useTheme } from 'next-themes';
import { FC, useEffect, useState } from 'react';
import Heading from '../components/public/Heading';
import Home from '../components/public/Home';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Courses from './components/home/Courses';
import Review from './components/home/Review';
import FAQ from './components/home/FAQ';

type Props = {};

const Page: FC<Props> = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const { theme, setTheme } = useTheme();
  const [route, setRoute] = useState('Login');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme('light');
  }, []);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen dark:bg-gray-900`}>
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
      <Footer route={route} open={open} setRoute={setRoute} setOpen={setOpen} />
    </div>
  );
};

export default Page;
