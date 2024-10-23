import Image from 'next/image'
import React from 'react'

type Props = {}

const Hero = (props: Props) => {
  return (
    <div>
      <div className="w-full 1000px:flex">
        {/* <div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1500ox:w-[700px] 1100px:h-[600px] 1100px:w-[600px] h-[50vh] w-[50vh] hero_animation rounded-full"></div> */}

        <div className="1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px]">
          <h2 className="dark:text-white text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[50px] font-[600] font-Josefin py-2 1000px:leading-[65px] 1500px:w-[90%] 1000px:ps-[80px] 1000px:mt-[150px]">
            Start your programming Journey with our Dedicated community!
          </h2>
          <h4 className="dark:text-white text-[#000000c7] text-[24px] px-3 w-full 1000px:text-[24px] font-[400] font-Josefin py-2 1000px:leading-[25px] 1500px:w-[90%] 1000px:ps-[80px]">
            Begin your coding adventure in our community, where learning is
            always appreciated and valued.
          </h4>
        </div>
        <div className="1000px:w-[65%] 1000px:min-h-screen justify-end mt-[60px] ml-[30px] 1000px:pt-[0] z-10">
          <Image
            src={require('../../../public/assets/banner_2.svg')}
            alt="Hero"
            className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-[10]"
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
