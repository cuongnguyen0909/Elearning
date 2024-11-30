import { FC, useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { IoPlayCircleOutline } from 'react-icons/io5';
import { formatTime } from '../../utils/formatHelper';
import { IoMdCheckmarkCircle } from 'react-icons/io';

interface CourseContentListProps {
  data: any;
  activeVideo?: number;
  setActiveVideo?: (value: number) => void;
  isDemo?: boolean;
  userData?: any;
  refetchUserData?: any;
}

const CourseContentList: FC<CourseContentListProps> = (props) => {
  const { data, activeVideo, setActiveVideo, isDemo, userData, refetchUserData } = props;

  const [visibleSection, setVisibleSection] = useState<Set<string>>(new Set<string>());
  const completedVideos: any[] = userData?.user?.completedVideos;
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
    <div className={`${!isDemo && 'sticky left-0 top-24 z-30 ml-[-30px]'} mt-[15px] w-full border bg-[#f6f1f1]`}>
      {videoSections?.map((section: string, indexOfSection: number) => {
        const isSectionVisible = visibleSection.has(section);

        // filter video by section
        const sectionVideos: any[] = data?.contents?.filter((video: any) => video.videoSection === section);
        // console.log('sectionVideos', sectionVideos);
        const sectionVideoCount: number = sectionVideos.length;
        const sectionVideoLength: number = sectionVideos.reduce(
          (totalLength: number, item: any) => totalLength + Number(item?.videoDuration),
          0
        );

        const sectionStartIndex: number = totalCount;
        totalCount += sectionVideoCount;

        return (
          <div
            className={` ${!isDemo && 'border border-[#00000022] bg-[#f7f9fa] shadow-md dark:border-b dark:border-[#ffffff8e] dark:bg-slate-900'} className-section ${isDemo && 'border-[#00000022] shadow-md dark:border dark:border-[#ffffff8e]'} `}
          >
            <div className={`${isDemo ? '' : 'hover:bg-[#fff] dark:hover:bg-slate-700'}`}>
              <div className="flex w-full gap-2">
                <div className="h-2 w-2"></div>
                {/* Render video section */}
                <div
                  className={`flex h-10 w-full cursor-pointer items-center justify-between gap-1`}
                  onClick={() => toggleSection(section)}
                >
                  <h2 className={`text-[18px] font-[600] text-black dark:text-white`}>
                    {indexOfSection + 1}. {section}
                  </h2>
                  <button className="mr-4 cursor-pointer text-black dark:text-white">
                    {isSectionVisible ? <BsChevronUp size={20} /> : <BsChevronDown size={20} />}
                  </button>
                </div>
              </div>
              <div className="flex w-full">
                <div className="h-2 w-4"></div>
                <div>
                  <h5 className="!text-[14px] font-thin text-black dark:text-white">
                    {sectionVideoCount} bài giảng • {formatTime(sectionVideoLength)}
                  </h5>
                  <div className="h-2"></div>
                </div>
              </div>
            </div>
            {isSectionVisible && (
              <div className="w-full gap-2 bg-[#ffffff4c]">
                {sectionVideos?.map((item: any, indexOfLesson: number) => {
                  const videoIndex: number = sectionStartIndex + indexOfLesson;
                  // check current video is completed or not
                  const completedVideo = completedVideos?.find(
                    (content: any) =>
                      content?.course?.toString() === data?._id && content?.contentId?.toString() === item?._id
                  );
                  return (
                    <div
                      className={`h-14 w-full gap-2 ${
                        videoIndex === activeVideo
                          ? 'bg-[#0093fc] dark:bg-slate-800 dark:text-white'
                          : completedVideos?.some(
                                (content: any) =>
                                  content?.course?.toString() === data?._id &&
                                  content?.contentId?.toString() === item?._id
                              )
                            ? 'cursor-pointer hover:bg-[#fff] dark:hover:bg-slate-800'
                            : 'cursor-not-allowed opacity-50'
                      } border-t transition-all ${isDemo ? 'cursor-pointer opacity-100' : ''} dark:text-white`}
                      key={item?._id}
                      onClick={() => {
                        if (
                          videoIndex === activeVideo || // Là video hiện tại
                          completedVideos?.some(
                            (content: any) =>
                              content?.course?.toString() === data?._id && content?.contentId?.toString() === item?._id
                          )
                        ) {
                          setActiveVideo && setActiveVideo(videoIndex);
                          refetchUserData && refetchUserData();
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="border-top flex items-center gap-2">
                          <div className="w-2"></div>
                          <div className="flex items-center">
                            <div className="">
                              <IoPlayCircleOutline
                                size={20}
                                className={`mr-2 text-black dark:text-white ${videoIndex === activeVideo && 'bg-[#0093fc] text-white dark:bg-slate-800 dark:text-white'}`}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <h1
                                  className={`text-[16px] text-black dark:text-white ${videoIndex === activeVideo && 'bg-[#0093fc] text-white dark:bg-slate-800 dark:text-white'} `}
                                >
                                  {indexOfSection + 1}.{indexOfLesson + 1}. {item?.title}{' '}
                                </h1>

                                <h5
                                  className={`text-black dark:text-white ${videoIndex === activeVideo && 'bg-[#0093fc] text-white dark:bg-slate-800 dark:text-white'}`}
                                >
                                  {formatTime(Number(item?.videoDuration))}
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end px-2">
                          {completedVideo?.isCompleted && (
                            <IoMdCheckmarkCircle size={20} className="bg-transparent text-green-500" />
                          )}
                        </div>
                      </div>
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
