'use client';
import { SessionProvider } from 'next-auth/react';
import { Josefin_Sans, Poppins, Arimo } from 'next/font/google';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../components/theme/ThemeProvider';
import './globals.css';
import { Providers } from './Provider';

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-Josefin'
});
const arimo = Arimo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-Arimo'
});

// export const metadata: Metadata = {
//     title: 'Create Next App',
//     description: 'Generated by create next app'
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${arimo.variable} ${josefin.variable} !bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black`}
        //  duration-300
      >
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
              {/* <Custom>{children}</Custom> */}
              {children}
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

// const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//    const { isLoading, isFetching, refetch, isUninitialized } = useLoadUserQuery({});
//    //    const refetchTeam = useCallback(() => {
//    //       if (!isUninitialized) {
//    //          refetch();
//    //       }
//    //    }, [isUninitialized, refetch]);
//    return <>{isLoading || isFetching ? <Loading /> : children}</>;
// };
