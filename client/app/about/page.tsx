'use client';

import React, { FC, useEffect, useState } from 'react';
import Heading from '../../components/public/Heading';
import { useTheme } from 'next-themes';
import { useSelector } from 'react-redux';
import Header from '../components/header/Header';
import About from '../components/about/About';
import Footer from '../components/footer/Footer';

interface PageProps {}

const page: FC<PageProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
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
      <Heading title="Privacy Policy" description="This is the privacy policy page" keywords="privacy, policy" />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
        setActiveItem={setActiveItem}
      />
      <About />
      <Footer route={route} open={open} setRoute={setRoute} setOpen={setOpen} />{' '}
    </div>
  );
};

export default page;
