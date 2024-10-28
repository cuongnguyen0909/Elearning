'use client'

import Link from 'next/link'
import React, { FC, useState } from 'react'
import NavItems from '../utils/NavItems'
import ThemeSwitcher from '../utils/ThemeSwitcher'
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from 'react-icons/hi'
import { useTheme } from 'next-themes'
import CustomModal from '../utils/CustomModal'
import Login from '../components/Auth/Login'
import SignUp from '../components/Auth/SignUp'
import Verification from '../components/Auth/Verification'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  activeItem: number
  route: string
  setRoute: (route: string) => void
}

const Header: FC<Props> = (props) => {
  const { activeItem, open, setOpen, route, setRoute } = props
  const [active, setActive] = useState(false)
  const [openSidebar, setOpenSidebar] = useState(false)
  const { theme } = useTheme()

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        setActive(true)
      } else {
        setActive(false)
      }
    })
  }

  const handleClose = (e: any) => {
    if (e.target.id === 'screen') {
      setOpenSidebar(false)
    }
  }

  return (
    <div
      className={`w-full relative ${theme === 'light'
        ? 'bg-[rgba(232,246,255,0.68)] text-lightText'
        : 'dark:bg-gray-900 dark:text-white'
        }`}
    >
      <div
        className={`${active
          ? 'dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500'
          : 'w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow'
          }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href={'/'}
                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
              >
                ELearning
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
            </div>
            <div className="flex items-center">
              <ThemeSwitcher />
              {/* only for mobile */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={30}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(!openSidebar)}
                />
              </div>
              <HiOutlineUserCircle
                size={30}
                className="cursor-pointer hidden 800px:block dark:text-white text-black"
                onClick={() => setOpen(true)}
              />
            </div>
          </div>
        </div>
        {/* mbile sidebar */}
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
              <NavItems activeItem={activeItem} isMobile={true} />
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer ml-5 my-2 text-black dark:text-white"
                onClick={() => setOpen(true)}
              />
              <br />
              <br />
              Copyright &copy; 2024 ELearning
            </div>
          </div>
        )}
      </div>
      {route === 'Login' && (
        <>
          {
            open && (
              <CustomModal
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                activeItem={activeItem}
                component={Login}
              />)
          }
        </>
      )}
      {route === 'Signup' && (
        <>
          {
            open && (
              <CustomModal
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                activeItem={activeItem}
                component={SignUp}
              />)
          }
        </>
      )}
      {route === 'Verification' && (
        <>
          {
            open && (
              <CustomModal
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                activeItem={activeItem}
                component={Verification}
              />)
          }
        </>
      )}
    </div>
  )
}

export default Header
