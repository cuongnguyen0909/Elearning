import React, { FC, useState } from 'react';
import CoursePlayer from '../admin/course/components/CoursePlayer';
import { AiFillStar, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineStar } from 'react-icons/ai';
import { styles } from '../../utils/style';
import Image from 'next/image';
import defaultAvatar from '../../../public/assets/avatar.png';
interface CourseContentMediaProps {
  data: any;
  id: any;
  activeVideo: number;
  setActiveVideo: (value: number) => void;
  user: any;
}

const CourseContentMedia: FC<CourseContentMediaProps> = (props) => {
  const { data, id, activeVideo, setActiveVideo, user } = props;
  const [activeBar, setActiveBar] = useState<number>(0);
  const [question, setQuestion] = useState<string>('');
  const [reply, setReply] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');

  const isReviewExist = data?.reviews?.find((review: any) => review?.user?._id === user?._id);

  return (
    <div className="m-auto w-[95%] py-4 text-black dark:text-white 800px:w-[86%]">
      <CoursePlayer videoUrl={data[activeVideo]?.videoUrl} title={data[activeVideo]?.title} />
      <div className="my-3 flex w-full items-center justify-between">
        <div
          className={`${styles.button} !min-h-[40px] !w-[unset] !py-[unset] ${activeVideo === 0 ? '!cursor-no-drop opacity-[.8]' : ''}`}
          onClick={() => setActiveVideo(activeVideo === 0 ? activeVideo : activeVideo - 1)}
        >
          <AiOutlineArrowLeft className="mr-2" />
          Bài học trước
        </div>
        <div
          className={`${styles.button} !min-h-[40px] !w-[unset] !py-[unset] ${activeVideo === data.length - 1 ? '!cursor-no-drop opacity-[.8]' : ''}`}
          onClick={() => setActiveVideo(activeVideo === data.length - 1 ? activeVideo : activeVideo + 1)}
        >
          <AiOutlineArrowRight className="mr-2" />
          Bài học tiếp theo
        </div>
      </div>
      <h1 className="pt-2 text-[25px] font-[600]">{data[activeVideo]?.title}</h1>
      <br />
      <div className="flex w-full items-center justify-between rounded bg-slate-500 bg-opacity-20 p-4 shadow-inner shadow-[bg-slate-700] backdrop-blur">
        {['Tổng quan', 'Tài liệu', 'Q&A', 'Đánh giá'].map((item: any, index: number) => (
          <h5
            key={index}
            className={`cursor-pointer 800px:text-[20px] ${activeBar === index && 'text-red-500'}`}
            onClick={() => setActiveBar(index)}
          >
            {item}
          </h5>
        ))}
      </div>
      <br />
      {activeBar === 0 && (
        <div className="border border-[#ffffff16] bg-white pb-24 shadow-lg dark:bg-slate-950">
          <p className="mb-3 whitespace-pre-line pl-4 pr-2 pt-4 text-[18x]">{data[activeVideo]?.description}</p>
        </div>
      )}
      {activeBar === 1 && (
        <div className="border border-[#ffffff16] bg-white pb-24 shadow-lg dark:bg-slate-950">
          {data[activeVideo]?.links?.map((link: any, index: number) => (
            <div className="mb-5 pl-4 pr-2 pt-4">
              <h2 className="text-black dark:text-white 800px:inline-block 800px:text-[20px]">
                {link?.title && link?.title}
              </h2>
              <a href={link?.url} className="inline-block text-[#4395c4] 800px:pl-2 800px:text-[20px]">
                {link?.url}
              </a>
            </div>
          ))}
        </div>
      )}
      {activeBar === 2 && (
        <div className="border border-[#ffffff16] bg-white pb-24 shadow-lg dark:bg-slate-950">
          <div className="flex w-full pl-4 pr-2 pt-4">
            <Image
              src={user?.avatar ? user?.avatar?.url : defaultAvatar}
              alt={'avatar'}
              width={50}
              height={50}
              className="h-[50px] w-[50px] rounded-full object-cover"
            />
            <textarea
              name=""
              id=""
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="ml-3 rounded border border-[#ffffff57] bg-transparent p-2 font-Poppins outline-none 800px:w-full 800px:text-[18px]"
              cols={30}
              rows={3}
              placeholder="Nhập bình luận của bạn..."
            ></textarea>
          </div>
          <div className="flex w-full justify-end">
            <div className={`${styles.button} mt-5 !h-[40px] !w-[unset] text-[14px]`}>Gửi bình luận</div>
          </div>
          <br />
          <br />
          <div className="h-1px w-full bg-[#ffffff3b]"></div>
          <div>{/* answer question */}</div>
        </div>
      )}
      {activeBar === 3 && (
        <div className="border border-[#ffffff16] bg-white pb-24 shadow-lg dark:bg-slate-950">
          <>
            {!isReviewExist && (
              <div className="flex w-full pl-4 pr-2 pt-4">
                <Image
                  src={user?.avatar ? user?.avatar?.url : defaultAvatar}
                  alt={'avatar'}
                  width={50}
                  height={50}
                  className="h-[50px] w-[50px] rounded-full object-cover"
                />
                <div className="w-full">
                  <h5 className="pl-3 text-[20px] font-[500] text-black dark:text-white">
                    Hãy để lại đánh giá của bạn về khóa học này <span className="text-red-500">*</span>
                  </h5>
                  <div className="ml-2 flex w-full pb-3">
                    {[1, 2, 3, 4, 5].map((item: any, index: number) =>
                      rating >= item ? (
                        <AiFillStar
                          key={index}
                          className="cursor-pointer text-yellow-400"
                          onClick={() => setRating(item)}
                          size={25}
                        />
                      ) : (
                        <AiOutlineStar
                          key={index}
                          className="cursor-pointer text-yellow-400"
                          onClick={() => setRating(item)}
                          size={25}
                        />
                      )
                    )}
                  </div>
                  <textarea
                    name=""
                    id=""
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="rounded border border-[#ffffff57] bg-transparent p-2 font-Poppins outline-none 800px:w-full 800px:text-[18px]"
                    cols={30}
                    rows={3}
                    placeholder=" Nhập đánh giá của bạn..."
                  ></textarea>
                </div>
              </div>
            )}
            <div className="flex w-full justify-end">
              <div className={`${styles.button} mr-2 mt-5 !h-[40px] !w-[unset] text-[18px] 800px:mr-0`}>Submit</div>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default CourseContentMedia;
