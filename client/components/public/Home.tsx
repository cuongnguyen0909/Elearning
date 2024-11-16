import React from 'react';
import Image from 'next/image';
import './Home.scss';

type Props = {};

const Home = (props: Props) => {
  return (
    <div>
      <div className="home-container">
        <div className="home-text-container">
          <h2 className="home-heading">
            Học lập trình một cách dễ dàng và hiệu quả
            <br /> cùng{' '}
            <span className="highlight">
              {' '}
              <span className="text-[#2190ff] dark:text-[#2190ff]">E</span>demy
            </span>
          </h2>
          <h4 className="home-subheading">Nơi cung cập những khóa học về lập trình tốt nhất</h4>
        </div>
        <div className="home-image-container">
          <Image src={require('../../public/assets/banner.jpeg')} alt="home" className="home-image" />
        </div>
      </div>
    </div>
  );
};

export default Home;
