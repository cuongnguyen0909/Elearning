'use client';
import React, { FC } from 'react';
import DashboardHeader from './DashboardHeader';

interface IDashboardHeroProps {}

const DashboardHero: FC<IDashboardHeroProps> = (props) => {
    return (
        <div>
            <DashboardHeader />
        </div>
    );
};

export default DashboardHero;
