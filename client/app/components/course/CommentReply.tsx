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
}

const CommentReply: FC<CommentReplyProps> = (props) => {
  const { data, activeVideo, reply, setReply, handleReply, user, setCommentId, commentId, handleDeleteSubmit } = props;
  console.log(data);
  return (
    <div>
      <>
        <div className="my-3 w-full">
          {data[activeVideo]?.comments?.map((comment: any, index: number) => (
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
              />
            </div>
          ))}
        </div>
      </>
    </div>
  );
};

export default CommentReply;
