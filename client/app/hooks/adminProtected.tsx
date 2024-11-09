import { redirect } from 'next/navigation';
import useAuthUser from './useAuthUser';
import React from 'react';
import { useSelector } from 'react-redux';
import { ROLE } from '../constants/enum';

interface IProtectedProps {
    children: React.ReactNode;
}

export default function AdminProtected({ children }: IProtectedProps) {
    const { user, isLoggedIn } = useSelector((state: any) => state.auth);
    if (user && isLoggedIn) {
        const isAdmin = user?.role === ROLE.ADMIN;
        return isAdmin ? children : redirect('/');
    } else {
        redirect('/');
    }
    return null;
}
