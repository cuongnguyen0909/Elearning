import React, { FC } from 'react';
import CommentItem from './CommentItem';

interface CommentReplyProps {
  data: any;
  activeVideo: number;
  reply: string;
  setReply: any;
  handleReply: any;
  user: any;
  commentId: string;
  setCommentId: (value: string) => void;
  handleDeleteSubmit: any;
  handleDeleteReplySubmit: any;
  replyCommentId: string;
  setReplyCommentId: (value: string) => void;
}

const CommentReply: FC<CommentReplyProps> = (props) => {
  const {
    data,
    activeVideo,
    reply,
    setReply,
    handleReply,
    user,
    setCommentId,
    commentId,
    handleDeleteSubmit,
    handleDeleteReplySubmit,
    replyCommentId,
    setReplyCommentId
  } = props;
  return (
    <div>
      <>
        <div className="my-3 w-full">
          {(data[activeVideo]?.comments && [...data[activeVideo]?.comments]?.reverse()).map(
            (comment: any, index: number) => (
              <div key={index}>
                <CommentItem
                  data={data}
                  activeVideo={activeVideo}
                  comment={comment}
                  reply={reply}
                  setReply={setReply}
                  handleReply={handleReply}
                  setCommentId={setCommentId}
                  commentId={commentId}
                  handleDeleteSubmit={handleDeleteSubmit}
                  handleDeleteReplySubmit={handleDeleteReplySubmit}
                  replyCommentId={replyCommentId}
                  setReplyCommentId={setReplyCommentId}
                />
              </div>
            )
          )}
        </div>
      </>
    </div>
  );
};

export default CommentReply;
