'use client';
import React, { FC, useState } from 'react';
import { formatDate, formatRelativeTime } from '../../utils/formatHelper';
import Image from 'next/image';
import { BiMessage } from 'react-icons/bi';
import ConfirmationModal from '../../../components/modal/ConfimationModal';
import { useSelector } from 'react-redux';
import defaultAvatar from '../../../public/assets/avatar.png';
interface CommentItemProps {
  data: any;
  activeVideo: number;
  comment: any;
  reply: string;
  setReply: (value: string) => void;
  handleReply: any;
  commentId: string;
  setCommentId: (value: string) => void;
  handleDeleteSubmit: any;
}

const CommentItem: FC<CommentItemProps> = (props) => {
  const { data, activeVideo, comment, reply, setReply, handleReply, commentId, setCommentId, handleDeleteSubmit } =
    props;
  const [replyActive, setReplyActive] = useState(false);
  const [commentRepliesState, setCommentRepliesState] = useState<any>(false);
  const [deleteState, setDeleteState] = useState<boolean>(false);
  const [visibleReplies, setVisibleReplies] = useState<{ [key: string]: boolean }>({});
  const { user } = useSelector((state: any) => state.auth);
  const isCurrentUserComment = comment?.user?._id === user?._id;

  const toggleReplies = (commentId: string) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  return (
    <>
      <div className="my-4 px-4">
        <div className="mb-2 flex gap-2">
          <div>
            <Image
              src={comment?.user?.avatar ? comment?.user?.avatar?.url : defaultAvatar}
              alt={'avatar'}
              width={40}
              height={40}
              className="h-[40px] w-[40px] rounded-full object-contain"
            />
          </div>
          <div className="w-full rounded-lg border bg-[#00000015] pl-3">
            <h5 className="text-[16px]">{comment?.user?.name}</h5>
            <p className="text-base">{comment?.comment}</p>
            <div className="flex gap-2">
              <small className="text-[#000000]">{formatRelativeTime(comment?.createdAt)} •</small>
              <small
                className="cursor-pointer text-[#000000] hover:underline"
                onClick={() => {
                  if (replyActive === false) {
                    setReplyActive(true);
                    setCommentId(comment?._id);
                  } else {
                    setReplyActive(false);
                    setCommentId('');
                  }
                }}
              >
                {!replyActive ? 'Phản hồi •' : 'Ẩn phản hồi •'}
              </small>
              {isCurrentUserComment && (
                <small
                  className="cursor-pointer text-[#000000] hover:underline"
                  onClick={() => {
                    if (deleteState === false) {
                      setDeleteState(true);
                      setCommentId(comment?._id);
                    } else {
                      setDeleteState(false);
                      setCommentId('');
                    }
                  }}
                >
                  Xóa bình luận
                </small>
              )}

              {/* <small className="text-[#000000]">{formatDate(comment?.createdAt)}</small> */}
            </div>
            <div className="flex w-full">
              {comment?.commentReplies?.length > 0 ? (
                <span
                  className="mr-2 cursor-pointer text-[14px] text-black hover:underline dark:text-white"
                  onClick={() => toggleReplies(comment._id)}
                >
                  {!visibleReplies[comment._id]
                    ? `Xem tất cả ${comment.commentReplies.length} phản hồi`
                    : 'Ẩn tất cả phản hồi'}
                </span>
              ) : (
                <span className="text-[14px] text-gray-500">Không có phản hồi</span>
              )}
              {/* <BiMessage size={14} className="cursor-pointer" /> */}
              {/* <span className="cursor-pointer text-[#000]">
                {comment?.commentRepies?.length === 0 ? 0 : comment?.commentRepies?.length}
              </span> */}
            </div>
            {visibleReplies[comment._id] && (
              <>
                {comment?.commentReplies?.map((reply: any, index: number) => (
                  <>
                    <div
                      className="my-5 flex w-full border-t border-[#1607078b] py-2 text-black dark:text-white"
                      key={index}
                    >
                      <div>
                        <Image
                          src={comment?.user?.avatar ? comment?.user?.avatar?.url : defaultAvatar}
                          alt={'avatar'}
                          width={40}
                          height={40}
                          className="h-[40px] w-[40px] rounded-full object-contain"
                        />
                      </div>
                      <div className="pl-2">
                        <h5 className="text-[16px]">{reply?.user?.name}</h5>
                        <p>
                          <span className="text-[#000000]">{reply?.reply}</span>
                        </p>
                        <small>{formatRelativeTime(reply?.createdAt)}</small>
                      </div>
                    </div>
                  </>
                ))}
              </>
            )}
            {replyActive && (
              <>
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Nhập phản hồi của bạn..."
                    value={reply}
                    onChange={(e: any) => setReply(e.target.value)}
                    className="mt-2 block w-full border-b border-[#000] bg-transparent outline-none placeholder:text-[14px]"
                  />
                  <button
                    className="float-end px-2 py-2 text-[14px] font-[400] text-[#000] hover:text-[#0000009d] dark:text-white"
                    onClick={() => handleReply()}
                  >
                    Gửi phản hồi
                  </button>
                </div>
                <div className="h-2 w-full"></div>
              </>
            )}
          </div>
        </div>
      </div>
      {deleteState && (
        <ConfirmationModal
          open={deleteState}
          setOpen={setDeleteState}
          title="Xác nhận xóa bình luận"
          message="Bạn có chắc chắn muốn xóa bình luận này không?"
          onConfirm={() => handleDeleteSubmit()}
        />
      )}
    </>
  );
};

export default CommentItem;
