import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';

interface CoursePlayerProps {
  videoUrl: string;
  title: string;
}

const CoursePlayer: FC<CoursePlayerProps> = (props) => {
  const { videoUrl, title } = props;
  const [videoData, setVideoData] = useState<any>({
    otp: '',
    playbackInfo: ''
  });

  useEffect(() => {
    axios
      .post(
        `http://localhost:8000/api/v1/course/get-vdocipher-otp`,
        { videoId: videoUrl }
        // {
        //    headers: {
        //       Accept: 'application/json',
        //       'Content-Type': 'application/json'
        //    }
        // }
      )
      .then((res: any) => {
        setVideoData(res.data);
      });
  }, [videoUrl]);
  return (
    <div
      style={{
        paddingTop: '56.25%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {videoData.otp && videoData.playbackInfo !== '' && (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData?.playbackInfo}`}
          style={{
            border: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          allowFullScreen={true}
          allow="encrypted-media"
        ></iframe>
      )}
    </div>
  );
};

export default CoursePlayer;
