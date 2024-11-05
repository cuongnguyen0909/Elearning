'use client';
import React, { FC } from 'react';
import DashboardHeader from './DashboardHeader';

interface DashboardHeroProps {}

const DashboardHero: FC<DashboardHeroProps> = (props) => {
    return (
        <div>
            <DashboardHeader />
        </div>
    );
};

export default DashboardHero;
