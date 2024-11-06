import React from 'react';
import Image from 'next/image';
import './Hero.scss';

type Props = {};

const Hero = (props: Props) => {
   return (
      <div>
         <div className="hero-container">
            <div className="hero-text-container">
               <h2 className="hero-heading">Join our community to kickstart your programming journey!</h2>
               <h4 className="hero-subheading">Here, learning and growth are always valued</h4>
            </div>
            <div className="hero-image-container">
               <Image src={require('../../public/assets/banner.jpeg')} alt="Hero" className="hero-image" />
            </div>
         </div>
      </div>
   );
};

export default Hero;
