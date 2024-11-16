import Image from 'next/image';
import React, { FC } from 'react';
import { styles } from '../../utils/style';
import ReviewCard from './ReviewCard';

interface ReviewProps {}

const Review: FC<ReviewProps> = (props) => {
  const reviews = [
    {
      name: 'Nguyễn Văn A',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      profession: 'Developer',
      comment: ' I am very happy with the course'
    },
    {
      name: 'Nguyễn Văn B',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      profession: 'Developer',
      comment: ' I am very happy with the course'
    },
    {
      name: 'Nguyễn Văn C',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      profession: 'Developer',
      comment: ' I am very happy with the course'
    },
    {
      name: 'Nguyễn Văn D',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      profession: 'Developer',
      comment: ' I am very happy with the course'
    },
    {
      name: 'Nguyễn Văn C',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      profession: 'Developer',
      comment: ' I am very happy with the course'
    },
    {
      name: 'Nguyễn Văn D',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      profession: 'Developer',
      comment: ' I am very happy with the course'
    }
  ];

  return (
    <div className="m-auto mt-20 w-[30%] border-b pb-20 pt-6 800px:w-[85%]">
      <div className="w-full items-center gap-10 800px:flex">
        <div className="w-full 800px:w-[50%]">
          <Image src={require('../../../public/assets/banner_2.svg')} alt="" width={800} height={800} />
        </div>
        <div className="w-full 800px:w-[50%]">
          <h3 className={`${styles.title} !text-[20px] !font-semibold 800px:!text-[40px]`}>Đánh giá từ học viên</h3>
          <br />
          <p className={`${styles.label} !text-[18px]`}>
            Dưới đây là những đánh giá từ học viên đã tham gia khóa học của chúng tôi và cảm nhận của họ về khóa học đó
          </p>
        </div>
        <br />
        <br />
      </div>
      <div className="mid:gap-[25px] broder-0 mt-14 grid grid-cols-2 pb-12 lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] md:[&>:nth-child(3)]:!mb-10 md:[&>:nth-child(6)]:!mt-[-30px]">
        {reviews && reviews?.map((review: any, index: number) => <ReviewCard item={review} key={index} />)}
      </div>
    </div>
  );
};

export default Review;
