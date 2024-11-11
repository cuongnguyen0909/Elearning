'use client';
import React, { FC, useState } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardWigets from './DashboardWigets';

interface DashboardHeroProps {
    isDashboard: boolean;
}

const DashboardHero: FC<DashboardHeroProps> = (props) => {
    const { isDashboard } = props;
    const [open, setOpen] = useState(false);
    return (
        <div>
            <DashboardHeader open={open} setOpen={setOpen} />
            {isDashboard && <DashboardWigets open={open} />}
        </div>
    );
};

export default DashboardHero;
