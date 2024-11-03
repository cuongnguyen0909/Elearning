import { redirect } from 'next/navigation';
import useAuthUser from './useAuthUser';
import React from 'react';
import { useSelector } from 'react-redux';

interface IProtectedProps {
    children: React.ReactNode;
}

export default function AdminProtected({ children }: IProtectedProps) {
    const { user } = useSelector((state: any) => state.auth);

    const isAdmin = user?.role === '99858';

    return isAdmin ? { children } : redirect('/dashboard');
}
