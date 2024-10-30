import { redirect } from 'next/navigation';
import useAuthUser from './useAuthUser';
import React from 'react';

interface IProtectedProps {
    children: React.ReactNode;
}

export default function Protected({ children }: IProtectedProps) {
    const isAuthenticated = useAuthUser();

    return isAuthenticated ? children : redirect('/');
}
