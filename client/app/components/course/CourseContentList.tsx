import React, { FC, useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { MdOutlineOndemandVideo } from 'react-icons/md';

interface CourseContentListProps {
  data: any;
  activeVideo?: number;
  setActiveVideo?: (value: number) => void;
  isDemo?: boolean;
}

const CourseContentList: FC<CourseContentListProps> = (props) => {
  const { data, activeVideo, setActiveVideo, isDemo } = props;
  const [visibleSection, setVisibleSection] = useState<Set<string>>(new Set<string>());

  //find unique section
  const videoSections: string[] = [...new Set<string>(data?.contents?.map((video: any) => video?.videoSection))];

  let totalCount: number = 0;

  const toggleSection = (sections: string) => {
    const newVisibleSection = new Set(visibleSection);
    if (visibleSection.has(sections)) {
      newVisibleSection.delete(sections);
    } else {
      newVisibleSection.add(sections);
    }
    setVisibleSection(newVisibleSection);
  };
  return (
    <div className={`${!isDemo && 'sticky left-0 top-24 z-30 ml-[-30px]'} mt-[15px] w-full`}>
      {videoSections?.map((section: string, index: number) => {
        const isSectionVisible = visibleSection.has(section);

        // filter video by section
        const sectionVideos: any[] = data?.contents?.filter((video: any) => video.videoSection === section);
        const sectionVideoCount: number = sectionVideos.length;
        const sectionVideoLength: number = sectionVideos.reduce(
          (totalLength: number, item: any) => totalLength + Number(item?.videoDuration),
          0
        );

        const sectionStartIndex: number = totalCount;
        totalCount += sectionVideoCount;

        const sectionContentHours: number = sectionVideoLength / 60;
        return (
          <div
            className={` ${!isDemo && 'border-b border-[#ffffff8e] pb-2'} className-section ${isDemo && 'border border-[#ffffff0a] shadow-lg'}`}
          >
            <div className="flex w-full">
              {/* Render video section */}
              <div
                className="flex w-full cursor-pointer items-center justify-between"
                onClick={() => toggleSection(section)}
              >
                <h2 className="text-[20px] text-black dark:text-white">{section}</h2>
                <button className="mr-4 cursor-pointer text-black dark:text-white">
                  {isSectionVisible ? <BsChevronUp size={20} /> : <BsChevronDown size={20} />}
                </button>
              </div>
            </div>
            <h5 className="text-black dark:text-white">
              {sectionVideoCount} Bài học •{' '}
              {sectionVideoLength < 60 ? sectionVideoLength : sectionContentHours.toFixed(2)}{' '}
              {sectionVideoLength > 60 ? 'giờ' : 'phút'}
            </h5>
            <br />
            {isSectionVisible && (
              <div className="w-full">
                {sectionVideos?.map((item: any, index: number) => {
                  const videoIndex: number = sectionStartIndex + index; // Calculate the video index within the one
                  const contentLength: number = Number(item?.videoDuration) / 60;
                  return (
                    <div
                      className={`w-full ${
                        videoIndex === activeVideo ? 'bg-slate-800' : ''
                      } cursor-pointer p-2 transition-all`}
                      key={item?._id}
                      onClick={() => {
                        if (isDemo) {
                          return;
                        }
                        setActiveVideo && setActiveVideo(videoIndex);
                      }}
                    >
                      <div className="flex items-start">
                        <div>
                          <MdOutlineOndemandVideo size={25} className="mr-2" color="#1cdada" />
                        </div>
                        <h1 className="inline-block break-words text-[18px] text-black dark:text-white">
                          {item?.title}
                        </h1>
                      </div>
                      <h5 className="pl-8 text-black dark:text-white">
                        {Number(item?.videoDuration) > 60 ? contentLength.toFixed(2) : Number(item?.videoDuration)}{' '}
                        {Number(item?.videoDuration) > 60 ? 'giờ' : 'phút'}
                      </h5>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;
