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
  useReplyCommentMutation,
  useDeleteReplyCommentMutation
} from '../../../redux/features/comment/commentApi';
import CommentReply from './CommentReply';
import {
  useAddReviewMutation,
  useDeleteReviewReplyMutation,
  useReplyToReviewMutation
} from '../../../redux/features/review/reviewApi';
import { useGetCoursesByIdQuery } from '../../../redux/features/course/courseApi';
import Rating from '../../../components/rating/Rating';
import { formatRelativeTime } from '../../utils/formatHelper';
import { ROLE } from '../../constants/enum';
import ConfirmationModal from '../../../components/modal/ConfimationModal';
import Loading from '../../../components/common/Loading';
import { MdVerified } from 'react-icons/md';

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
  const [comment, setComment] = useState<string>('');
  const [commentId, setCommentId] = useState<string>('');
  const [replyCommentId, setReplyCommentId] = useState<string>('');
  const [replyCommentContent, setReplyCommentContent] = useState<string>('');
  const [replyId, setReplyId] = useState<string>('');
  const [reviewId, setReviewId] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [replyReview, setReplyReview] = useState<string>('');
  const [isReplyReview, setIsReplyReview] = useState<boolean>(false);
  const [replyReviewId, setReplyReviewId] = useState<string>('');
  const [isDeleteReviewReply, setIsDeleteReviewReply] = useState<boolean>(false);
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});

  const toggleReplies = (reviewId: string) => {
    setShowReplies((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const { data: courseData, refetch: refectCourse } = useGetCoursesByIdQuery(id, {
    refetchOnMountOrArgChange: true
  });
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

  const [addReview, { data: reviewData, isLoading: reviewLoading, isSuccess: reviewSuccess, error: reviewError }] =
    useAddReviewMutation();

  const [
    replyToReview,
    { data: replyReviewData, isLoading: replyReviewLoading, isSuccess: replyReviewSuccess, error: replyReviewError }
  ] = useReplyToReviewMutation();

  const [
    deleteReviewReply,
    {
      data: deleteReviewReplyData,
      isLoading: deleteReviewReplyLoading,
      isSuccess: deleteReviewReplySuccess,
      error: deleteReviewReplyError
    }
  ] = useDeleteReviewReplyMutation();

  const [
    deleteReplyComment,
    { isLoading: deleteReplyCommentLoading, isSuccess: deleteReplyCommentSuccess, error: deleteReplyCommentError }
  ] = useDeleteReplyCommentMutation();
  const isReviewExist = courseData?.course?.reviews?.find((review: any) => review?.user?._id === user?._id);
  const isReviewReplyExist = courseData?.course?.reviews?.find((review: any) =>
    // review?.reviewReplies?.find((reply: any) => reply?.user?._id === user?._id)
    {
      if (review?.reviewReplies) {
        return review?.reviewReplies?.find((reply: any) => reply?.user?._id === user?._id);
      }
    }
  );
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

  const handleReplyComment = async () => {
    if (replyCommentContent.length === 0) {
      toast.error('Phản hồi không được để trống', {
        duration: 2000
      });
    } else {
      await replyComment({
        reply: replyCommentContent,
        commentId: commentId
      });
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

  const handleDeleteSubmit = async () => {
    if (commentId) {
      await deleteComment({ commentId, courseId: id, contentId: data[activeVideo]?._id });
    }
  };

  const handleDeleteCommentReplySubmit = async () => {
    if (commentId) {
      await deleteReplyComment({ commentId, replyId: replyCommentId });
    }
  };

  const handleReviewSubmit = async () => {
    if (review.length === 0) {
      toast.error('Đánh giá không được để trống', {
        duration: 2000
      });
    } else if (rating === 0) {
      toast.error('Vui lòng chọn số sao', {
        duration: 2000
      });
    } else {
      await addReview({
        review,
        rating: rating.toString(),
        courseId: id
      });
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

  useEffect(() => {
    if (reviewSuccess) {
      toast.success('Đánh giá thành công', {
        duration: 2000
      });
      setReview('');
      setRating(0);
      refectCourse();
    }
    if (reviewError) {
      if ('data' in reviewError) {
        const errorData = reviewError.data as any;
        toast.error(errorData.message, {
          duration: 2000
        });
      }
    }
  }, [reviewSuccess, reviewError]);

  const handleReplyReviewSubmit = async () => {
    if (replyReview.length === 0) {
      toast.error('Phản hồi không được để trống', {
        duration: 2000
      });
    } else {
      await replyToReview({
        reply: replyReview,
        reviewId: replyId,
        courseId: id
      });
    }
  };

  useEffect(() => {
    if (replyReviewSuccess) {
      toast.success('Phản hồi thành công', {
        duration: 2000
      });
      setReplyReview('');
      setIsReplyReview(false);
      setReplyReviewId('');
      setReviewId('');
      setReplyId('');
      setShowReplies({});
      refectCourse();
    }
    if (replyReviewError) {
      if ('data' in replyReviewError) {
        const errorData = replyReviewError.data as any;
        toast.error(errorData.message, {
          duration: 2000
        });
      }
    }
  }, [replyReviewSuccess, replyReviewError]);

  const handleDeleteReviewReplySubmit = async () => {
    if (replyReviewId) {
      await deleteReviewReply({ reviewId, replyId: replyReviewId });
    }
  };

  useEffect(() => {
    if (deleteReviewReplySuccess) {
      toast.success('Xóa phản hồi thành công', {
        duration: 2000
      });
      refectCourse();
    }
    if (deleteReviewReplyError) {
      if ('data' in deleteReviewReplyError) {
        const errorData = deleteReviewReplyError.data as any;
        toast.error(errorData.message, {
          duration: 2000
        });
      }
    }
  }, [deleteReviewReplySuccess, deleteReviewReplyError]);

  useEffect(() => {
    if (deleteReplyCommentSuccess) {
      toast.success('Xóa phản hồi thành công', {
        duration: 2000
      });
      refetch();
    }
    if (deleteReplyCommentError) {
      if ('data' in deleteReplyCommentError) {
        const errorData = deleteReplyCommentError.data as any;
        toast.error(errorData.message, {
          duration: 2000
        });
      }
    }
  }, [deleteReplyCommentSuccess, deleteReplyCommentError]);
  return (
    <>
      {(reviewLoading ||
        commentLoading ||
        replyCommentLoading ||
        replyReviewLoading ||
        deleteReviewReplyLoading ||
        deleteReplyCommentLoading) && <Loading />}
      <div className="m-auto min-h-screen w-[95%] py-4 text-black dark:text-white 800px:w-[86%]">
        <div className="w-full border border-[#0002] shadow-lg dark:border-[#ffffff57]">
          <CoursePlayer videoUrl={data?.[activeVideo]?.videoUrl} title={data?.[activeVideo]?.title} />
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
            className={`${styles.button} !min-h-[40px] !w-[unset] !py-[unset] !text-white ${activeVideo === data?.length - 1 ? '!cursor-no-drop opacity-[.8]' : ''}`}
            onClick={() => setActiveVideo(activeVideo === data?.length - 1 ? activeVideo : activeVideo + 1)}
          >
            <AiOutlineArrowRight className="mr-2 text-white" />
            Bài học tiếp theo
          </div>
        </div>
        <div className="h-16">
          <h1 className="pt-2 text-[25px] font-[600]">{data?.[activeVideo]?.title}</h1>
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

        {/* description */}
        {activeBar === 0 && (
          <div className="min-h-[300px] border border-[#ffffff16] bg-white pb-24 shadow-md dark:bg-slate-950">
            <p className="mb-3 whitespace-pre-line pl-4 pr-2 pt-4 text-[18x]">{data?.[activeVideo]?.description}</p>
          </div>
        )}

        {/* document */}
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

        {/* comment */}
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
                handleDeleteReplySubmit={handleDeleteCommentReplySubmit}
                replyCommentId={replyCommentId}
                setReplyCommentId={setReplyCommentId}
              />
            </div>
          </div>
        )}

        {/* review */}
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
                    className="h-[50px] w-[50px] rounded-full object-contain"
                  />
                  <div className="w-full">
                    <h5 className="pl-3 text-[18px] font-[500] text-black dark:text-white">
                      Hãy để lại đánh giá của bạn về khóa học này <span className="text-red-500">*</span>
                    </h5>
                    <div className="ml-2 flex w-full pb-3">
                      {[1, 2, 3, 4, 5].map((item: any, index: number) =>
                        rating >= item ? (
                          <AiFillStar
                            key={index}
                            className="cursor-pointer text-yellow-400"
                            onClick={() => setRating(item)}
                            size={30}
                          />
                        ) : (
                          <AiOutlineStar
                            key={index}
                            className="cursor-pointer text-yellow-400"
                            onClick={() => setRating(item)}
                            size={30}
                          />
                        )
                      )}
                    </div>
                    <textarea
                      name=""
                      id=""
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      className="rounded border border-[#00000027] bg-transparent p-2 font-Arimo outline-none placeholder:text-[18px] dark:border-[#ffffff57] 800px:w-full 800px:text-[18px]"
                      cols={30}
                      rows={3}
                      placeholder=" Nhập đánh giá của bạn..."
                    ></textarea>
                  </div>
                </div>
              )}
              <div className="flex w-full justify-end">
                <div
                  className={`${styles.button} mr-2 mt-5 !h-[40px] !w-[unset] text-[18px] !text-white 800px:mr-0 ${reviewLoading && 'cursor-not-allowed opacity-50'} `}
                  onClick={
                    reviewLoading
                      ? () => {}
                      : () => {
                          handleReviewSubmit();
                        }
                  }
                >
                  Gửi đánh giá
                </div>
              </div>
              <div className="h-10 w-full border-b bg-[#ffffff3b]"></div>
              {courseData && (
                <div className="w-full">
                  {(courseData?.course?.reviews && [...courseData?.course?.reviews].reverse())?.map(
                    (review: any, index: number) => (
                      <div className="my-5 w-full px-4" key={index}>
                        <div className="flex w-full gap-2">
                          <div>
                            <Image
                              src={review?.user?.avatar ? review?.user?.avatar?.url : defaultAvatar}
                              alt={'avatar'}
                              width={50}
                              height={50}
                              className="h-[50px] w-[50px] rounded-full object-contain"
                            />
                          </div>
                          <div className="flex w-full flex-col gap-2 rounded-lg bg-[#00000015] pb-4 pt-2">
                            <div className="flex items-center gap-4">
                              <h1 className="pl-3 text-[16px] font-[500] text-black dark:text-white">
                                {review?.user?.name}
                              </h1>
                              <div className="mt-1">
                                <Rating rating={review?.rating} />
                              </div>
                            </div>
                            <div className="pl-3">
                              <p className="text-[18px]">{review?.review}</p>
                            </div>
                            <div className="flex items-center gap-2 pl-3">
                              <small>{formatRelativeTime(review?.createdAt)}</small>
                              {user?.role === ROLE.ADMIN && (
                                <small
                                  className="cursor-pointer hover:underline"
                                  onClick={() => {
                                    toggleReplies(review?._id);
                                    setReplyId(review?._id);
                                    setIsReplyReview(!isReplyReview);
                                  }}
                                >
                                  {!isReplyReview ? `• Phản hồi` : `• Ẩn phản hồi`}
                                </small>
                              )}
                            </div>
                            <div>
                              {showReplies[review?._id] && (
                                <>
                                  <div className="relative w-full px-4">
                                    <input
                                      type="text"
                                      placeholder="Nhập phản hồi của bạn..."
                                      value={replyReview}
                                      onChange={(e: any) => {
                                        setReplyReview(e.target.value);
                                      }}
                                      className="mt-2 block w-full border-b border-[#000] bg-transparent outline-none placeholder:text-[14px]"
                                    />
                                    <button
                                      className="float-end px-2 py-2 text-[14px] font-[400] text-[#000] hover:text-[#0000009d] dark:text-white"
                                      onClick={() => handleReplyReviewSubmit()}
                                    >
                                      Gửi phản hồi
                                    </button>
                                  </div>
                                  <div className="h-2 w-full"></div>
                                </>
                              )}
                            </div>
                            {review?.reviewReplies?.map((reply: any, index: number) => (
                              <div
                                className="flex w-full border-t border-[#1607078b] px-4 py-2 text-black dark:text-white"
                                key={index}
                              >
                                <div>
                                  <Image
                                    src={reply?.user?.avatar ? reply?.user?.avatar?.url : defaultAvatar}
                                    alt={'avatar'}
                                    width={40}
                                    height={40}
                                    className="h-[40px] w-[40px] rounded-full object-contain"
                                  />
                                </div>
                                <div className="pl-2">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-[16px]">{reply?.user?.name}</h5>
                                    {reply?.user?.role === ROLE.ADMIN && <MdVerified className="text-blue-600" />}
                                  </div>
                                  <p>
                                    <span className="text-[#000000]">{reply?.reply}</span>
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <small>{formatRelativeTime(reply?.createdAt)}</small>
                                    {isReviewReplyExist && (
                                      <small
                                        className="cursor-pointer hover:underline"
                                        onClick={() => {
                                          setIsDeleteReviewReply(true);
                                          setReplyReviewId(reply?._id);
                                          setReviewId(review?._id);
                                        }}
                                      >
                                        • Xóa phản hồi
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </>
          </div>
        )}
        {isDeleteReviewReply && (
          <ConfirmationModal
            open={isDeleteReviewReply}
            setOpen={setIsDeleteReviewReply}
            title="Xác nhận xóa phản hồi"
            message="Bạn có chắc chắn muốn xóa phản hồi này không?"
            onConfirm={() => handleDeleteReviewReplySubmit()}
          />
        )}
      </div>
    </>
  );
};

export default CourseContentMedia;
