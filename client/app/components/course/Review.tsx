import React, { FC, useEffect, useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import Image from 'next/image';
import defaultAvatar from '../../../public/assets/avatar.png';
import toast from 'react-hot-toast';
import { useReplyToReviewMutation } from '../../../redux/features/review/reviewApi';
import { formatRelativeTime } from '../../utils/formatHelper';
import { ROLE } from '../../constants/enum';

interface ReviewProps {
  courseData: any;
  user: any;
  refetch: () => void;
}

const Reviews: FC<ReviewProps> = ({ courseData, user, refetch }) => {
  const [replyReviewMap, setReplyReviewMap] = useState<Record<string, boolean>>({});
  const [replyContentMap, setReplyContentMap] = useState<Record<string, string>>({});
  const [replyToReview, { isLoading, isSuccess, error }] = useReplyToReviewMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success('Phản hồi thành công', { duration: 2000 });
      setReplyContentMap({});
      refetch();
    }
    if (error) {
      if ('data' in error) {
        const errorData = error.data as any;
        toast.error(errorData.message, { duration: 2000 });
      }
    }
  }, [isSuccess, error]);

  const handleToggleReplies = (reviewId: string) => {
    setReplyReviewMap((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleReplyChange = (reviewId: string, value: string) => {
    setReplyContentMap((prev) => ({
      ...prev,
      [reviewId]: value
    }));
  };

  const handleReplySubmit = async (reviewId: string) => {
    const replyContent = replyContentMap[reviewId];
    if (!replyContent) {
      toast.error('Phản hồi không được để trống', { duration: 2000 });
      return;
    }
    await replyToReview({
      reviewId,
      reply: replyContent,
      courseId: courseData?.course?._id
    });
  };

  return (
    <div className="w-full">
      {courseData?.course?.reviews?.map((review: any) => (
        <div key={review._id} className="my-5 px-4">
          <div className="flex items-center gap-2">
            <Image
              src={review.user?.avatar || defaultAvatar}
              alt="avatar"
              width={50}
              height={50}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <h5 className="text-lg font-medium">{review.user?.name}</h5>
              <p className="text-gray-600">{formatRelativeTime(review.createdAt)}</p>
            </div>
          </div>
          <p className="mt-3 pl-4">{review.review}</p>
          <div className="mt-3 pl-4">
            <button onClick={() => handleToggleReplies(review._id)} className="text-sm text-blue-500 hover:underline">
              {replyReviewMap[review._id] ? 'Ẩn phản hồi' : 'Hiện phản hồi'}
            </button>
          </div>

          {replyReviewMap[review._id] && (
            <div className="mt-4 space-y-3 pl-8">
              {/* Existing Replies */}
              {review.replies?.map((reply: any, index: number) => (
                <div key={index} className="border-l-2 pl-3">
                  <p className="text-gray-800">{reply.reply}</p>
                  <p className="text-sm text-gray-500">
                    Phản hồi bởi {reply.admin?.name} • {formatRelativeTime(reply.createdAt)}
                  </p>
                </div>
              ))}

              {/* Add Reply for Admin */}
              {user?.role === ROLE.ADMIN && (
                <div>
                  <textarea
                    value={replyContentMap[review._id] || ''}
                    onChange={(e) => handleReplyChange(review._id, e.target.value)}
                    className="w-full rounded border p-2 text-sm"
                    placeholder="Nhập phản hồi của bạn..."
                  />
                  <button
                    onClick={() => handleReplySubmit(review._id)}
                    disabled={isLoading}
                    className="mt-2 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
                  >
                    Gửi phản hồi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Reviews;
