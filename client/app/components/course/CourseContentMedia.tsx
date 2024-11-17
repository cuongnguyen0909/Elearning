import React, { FC, useEffect, useState } from 'react';
import CoursePlayer from '../admin/course/components/CoursePlayer';
import { AiFillStar, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineStar } from 'react-icons/ai';
import { styles } from '../../utils/style';
import Image from 'next/image';
import defaultAvatar from '../../../public/assets/avatar.png';
import toast from 'react-hot-toast';
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useReplyCommentMutation
} from '../../../redux/features/comment/commentApi';
import CommentReply from './CommentReply';

interface CourseContentMediaProps {
  data: any;
  id: any;
  activeVideo: number;
  setActiveVideo: (value: number) => void;
  user: any;
  refetch?: any;
}

const CourseContentMedia: FC<CourseContentMediaProps> = (props) => {
  const { data, id, activeVideo, setActiveVideo, user, refetch } = props;
  const [activeBar, setActiveBar] = useState<number>(0);
  // const [question, setQuestion] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [commentId, setCommentId] = useState<string>('');
  const [replyCommentContent, setReplyCommentContent] = useState<string>('');
  const [replyId, setReplyId] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [replyReview, setReplyReview] = useState<string>('');
  const [addComment, { data: commentData, isLoading: commentLoading, isSuccess: commentSuccess, error: commentError }] =
    useAddCommentMutation();
  const [
    deleteComment,
    {
      data: deleteCommentData,
      isLoading: deleteCommentLoading,
      isSuccess: deleteCommentSuccess,
      error: deleteCommentError
    }
  ] = useDeleteCommentMutation();

  const [
    replyComment,
    { data: replyCommentData, isLoading: replyCommentLoading, isSuccess: replyCommentSuccess, error: replyCommentError }
  ] = useReplyCommentMutation();
  const isReviewExist = data?.reviews?.find((review: any) => review?.user?._id === user?._id);

  const handleComment = () => {
    if (comment.length === 0) {
      toast.error('Bình luận không được để trống', {
        duration: 2000
      });
    } else {
      addComment({
        comment,
        courseId: id,
        contentId: data[activeVideo]?._id
      });
    }
  };

  useEffect(() => {
    if (commentSuccess) {
      toast.success('Bình luận thành công', {
        duration: 2000
      });
      setComment('');
      refetch();
    }
    if (commentError) {
      if ('data' in commentError) {
        const errorData = commentError.data as any;
        toast.error(errorData.message, {
          duration: 2000
        });
      }
    }
  }, [commentSuccess, commentError]);

  const handleReplyComment = () => {
    if (replyCommentContent.length === 0) {
      toast.error('Phản hồi không được để trống', {
        duration: 2000
      });
    } else {
      replyComment({
        reply: replyCommentContent,
        commentId: commentId
      });
      // console.log('replyCommentContent', replyCommentContent);
      // console.log('commentId', commentId);
    }
  };

  useEffect(() => {
    if (replyCommentSuccess) {
      toast.success('Phản hồi thành công', {
        duration: 2000
      });
      setReplyCommentContent('');
      refetch();
    }
    if (replyCommentError) {
      if ('data' in replyCommentError) {
        const errorData = replyCommentError.data as any;
        toast.error(errorData.message, {
          duration: 2000
        });
      }
    }
  }, [replyCommentSuccess, replyCommentError]);

  const handleDeleteSubmit = () => {
    if (commentId) {
      deleteComment({ commentId, courseId: id, contentId: data[activeVideo]?._id });
    }
  };

  useEffect(() => {
    if (deleteCommentSuccess) {
      toast.success('Xóa bình luận thành công', {
        duration: 2000
      });
      refetch();
    }
    if (deleteCommentError) {
      if ('data' in deleteCommentError) {
        const errorData = deleteCommentError.data as any;
        toast.error(errorData.message, {
          duration: 2000
        });
      }
    }
  }, [deleteCommentSuccess, deleteCommentError]);
  return (
    <div className="m-auto min-h-screen w-[95%] py-4 text-black dark:text-white 800px:w-[86%]">
      <div className="w-full border border-[#0002] shadow-lg dark:border-[#ffffff57]">
        <CoursePlayer videoUrl={data[activeVideo]?.videoUrl} title={data[activeVideo]?.title} />
      </div>
      <div className="my-3 flex w-full items-center justify-between">
        <div
          className={`${styles.button} !min-h-[40px] !w-[unset] !py-[unset] !text-white ${activeVideo === 0 ? '!cursor-no-drop opacity-[.8]' : ''}`}
          onClick={() => setActiveVideo(activeVideo === 0 ? activeVideo : activeVideo - 1)}
        >
          <AiOutlineArrowLeft className="mr-2 text-white" />
          Bài học trước
        </div>
        <div
          className={`${styles.button} !min-h-[40px] !w-[unset] !py-[unset] !text-white ${activeVideo === data.length - 1 ? '!cursor-no-drop opacity-[.8]' : ''}`}
          onClick={() => setActiveVideo(activeVideo === data.length - 1 ? activeVideo : activeVideo + 1)}
        >
          <AiOutlineArrowRight className="mr-2 text-white" />
          Bài học tiếp theo
        </div>
      </div>
      <div className="h-16">
        <h1 className="pt-2 text-[25px] font-[600]">{data[activeVideo]?.title}</h1>
      </div>
      <div className="flex w-full items-center justify-between rounded border border-[#00000020] bg-slate-500 bg-opacity-20 p-4 shadow-inner shadow-[bg-slate-700] backdrop-blur">
        {['Tổng quan', 'Tài liệu', 'Q&A', 'Đánh giá'].map((item: any, index: number) => (
          <h5
            key={index}
            className={`cursor-pointer font-[500] 800px:text-[18px] ${activeBar === index && 'text-[#9c4aa0]'}`}
            onClick={() => setActiveBar(index)}
          >
            {item}
          </h5>
        ))}
      </div>
      {activeBar === 0 && (
        <div className="min-h-[300px] border border-[#ffffff16] bg-white pb-24 shadow-md dark:bg-slate-950">
          <p className="mb-3 whitespace-pre-line pl-4 pr-2 pt-4 text-[18x]">{data[activeVideo]?.description}</p>
        </div>
      )}
      {activeBar === 1 && (
        <div className="min-h-[300px] min-w-[450px] border border-[#ffffff16] bg-white pb-24 shadow-md dark:bg-slate-950">
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
        <div className="min-h-[300px] min-w-[450px] border border-[#ffffff16] bg-white pb-24 shadow-md dark:bg-slate-950">
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
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="shadowm-sm ml-3 rounded border border-[#00000031] bg-transparent p-2 font-Arimo outline-none 800px:w-full 800px:text-[18px]"
              cols={30}
              rows={3}
              placeholder="Nhập bình luận của bạn..."
            ></textarea>
          </div>
          <div className="flex w-full justify-end">
            <div
              className={`${styles.button} mt-5 !h-[40px] !w-[unset] text-[14px] !text-white ${commentLoading && 'cursor-not-allowed opacity-50'} `}
              onClick={
                commentLoading
                  ? () => {}
                  : () => {
                      handleComment();
                    }
              }
            >
              Gửi bình luận
            </div>
          </div>
          <div className="h-10 w-full border-b bg-[#ffffff3b]"></div>
          <div>
            <CommentReply
              data={data}
              activeVideo={activeVideo}
              reply={replyCommentContent}
              setReply={setReplyCommentContent}
              handleReply={handleReplyComment}
              user={user}
              setCommentId={setCommentId}
              commentId={commentId}
              handleDeleteSubmit={handleDeleteSubmit}
            />
          </div>
        </div>
      )}
      {activeBar === 3 && (
        <div className="min-h-[300px] min-w-[450px] border border-[#ffffff16] bg-white pb-24 shadow-lg dark:bg-slate-950">
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
                    className="rounded border border-[#00000027] bg-transparent p-2 font-Arimo outline-none dark:border-[#ffffff57] 800px:w-full 800px:text-[18px]"
                    cols={30}
                    rows={3}
                    placeholder=" Nhập đánh giá của bạn..."
                  ></textarea>
                </div>
              </div>
            )}
            <div className="flex w-full justify-end">
              <div className={`${styles.button} mr-2 mt-5 !h-[40px] !w-[unset] text-[18px] !text-white 800px:mr-0`}>
                Gửi đánh giá
              </div>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default CourseContentMedia;
