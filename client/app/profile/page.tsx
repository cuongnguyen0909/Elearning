'use client';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import Heading from '../../components/public/Heading';
import Header from '../components/header/Header';
import Protected from '../hooks/useProtected';
import Profile from '../components/profile/Profile';
import { useSelector } from 'react-redux';
import Footer from '../components/footer/Footer';

type Props = {};

const page: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
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
        <div className={`min-h-screen dark:bg-gray-900`}>
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
            setActiveItem={setActiveItem}
          />
          <Profile user={user} />
          <Footer route={route} open={open} setRoute={setRoute} setOpen={setOpen} />
        </div>
      </Protected>
    </div>
  );
};

export default page;
