import React, { FC } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { BsStarHalf } from 'react-icons/bs';

interface RatingProps {
  rating: number;
  isDemo?: boolean;
}

const Rating: FC<RatingProps> = ({ rating, isDemo }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<AiFillStar key={i} size={`${isDemo ? 20 : 16}`} color="#f6b100" className="cursor-pointer" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <BsStarHalf key={i} size={isDemo ? 17.5 : 14} color="#f6ba00" className="ml-1 mt-[0.75px] cursor-pointer" />
      );
    } else {
      stars.push(<AiOutlineStar key={i} size={isDemo ? 20 : 16} color="#f6b100" className="cursor-pointer" />);
    }
  }

  return <div className="ml-2 flex 800px:ml-0 800px:mt-0">{stars}</div>;
};

export default Rating;
