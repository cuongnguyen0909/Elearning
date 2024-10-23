'use client'

import React, { FC, useState } from 'react'
import Heading from './utils/Heading'
import Header from './components/Header'
import Hero from './components/Route/Hero'
import { useTheme } from 'next-themes'

type Props = {}

const Page: FC<Props> = (props: Props) => {
  const [open, setOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(0)
  const { theme } = useTheme()
  return (
    <div
      className={`min-h-screen ${
        theme === 'light'
          ? 'bg-gradient-to-l from-blue-100 to-blue-200'
          : 'dark:bg-gray-900'
      }`}
    >
      <Heading
        title="ELearning"
        description="ELearning is a platform for learning."
        keywords="ELearning,Programming,MERN,Redux,Science"
      />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} />
      <Hero />
    </div>
  )
}

export default Page
