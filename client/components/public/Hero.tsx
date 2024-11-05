import React from 'react';
import Image from 'next/image';
import './Hero.scss';

type Props = {};

const Hero = (props: Props) => {
    return (
        <div>
            <div className="hero-container">
                <div className="hero-text-container">
                    <h2 className="hero-heading">Start your programming Journey with our Dedicated community!</h2>
                    <h4 className="hero-subheading">
                        Begin your coding adventure in our community, where learning is always appreciated and valued.
                    </h4>
                </div>
                <div className="hero-image-container">
                    <Image src={require('../../public/assets/banner_2.svg')} alt="Hero" className="hero-image" />
                </div>
            </div>
        </div>
    );
};

export default Hero;
