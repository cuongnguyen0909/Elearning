import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineDelete, AiOutlinePlusCircle } from 'react-icons/ai';
import { BsLink45Deg, BsPencil } from 'react-icons/bs';
import { MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { styles } from '../../../../utils/style';
import { MESSAGE } from '../../../../constants/enum';
interface CourseContentProps {
  active: number;
  setActive: (value: number) => void;
  courseContent: any;
  setCourseContent: any;
  handleSubmit: any;
}

const CourseContent: FC<CourseContentProps> = (props) => {
  const { active, setActive, courseContent, setCourseContent, handleSubmit: handleCourseSubmit } = props;
  const [isCollapsed, setIsCollapsed] = useState(Array(courseContent?.length).fill(false));
  const [activeSection, setActiveSection] = useState(1);
  const [focusedInputIndex, setFocusedInputIndex] = useState<number | null>(null);
  const handleSubmit = (e: any) => {
    e.preventDefault();
  };
  const handleCollapseToggle = (index: number) => {
    const updatedCollapsed = [...isCollapsed];
    updatedCollapsed[index] = !updatedCollapsed[index];
    setIsCollapsed(updatedCollapsed);
  };

  const handleRemoveLink = (index: number, linkIndex: number) => {
    const updatedData = [...courseContent];
    updatedData[index].links?.splice(linkIndex, 1);
    setCourseContent(updatedData);
  };

  const handleAddLink = (index: number) => {
    setCourseContent((prevContent: any) => {
      // Tạo một bản sao của `prevContent` với mảng mới cho `links`
      const updatedData = prevContent.map((item: any, idx: number) => {
        if (idx === index) {
          return {
            ...item,
            links: [...(item.links || []), { title: '', url: '' }]
          };
        }
        return item;
      });
      return updatedData;
    });
  };

  const handleNewCourseContent = (content: any, e: any) => {
    e.preventDefault();
    if (
      content?.title === '' ||
      content?.videoUrl === '' ||
      content?.description === '' ||
      content?.links?.[0]?.title === '' ||
      content?.links?.[0]?.url === '' ||
      content?.videoDuration === ''
    ) {
      toast.error(MESSAGE.FILL_ALL_FIELDS);
    } else {
      let newVideoSection = '';
      if (courseContent?.length > 0) {
        const lastVideoSection = courseContent[courseContent?.length - 1]?.videoSection;

        //use the last videoSection if available, else use user input
        if (lastVideoSection) {
          newVideoSection = lastVideoSection;
        }
        const newContent = {
          title: '',
          videoUrl: '',
          description: '',
          videoSection: newVideoSection,
          videoDuration: '',
          links: [{ title: '', url: '' }],
          suggestion: ''
        };

        setCourseContent([...courseContent, newContent]);
      }
    }
  };

  const addNewSection = () => {
    if (
      courseContent[courseContent?.length - 1]?.title === '' ||
      courseContent[courseContent?.length - 1]?.videoUrl === '' ||
      courseContent[courseContent?.length - 1]?.description === '' ||
      courseContent[courseContent?.length - 1]?.links?.[0]?.title === '' ||
      courseContent[courseContent?.length - 1]?.links?.[0]?.url === '' ||
      courseContent[courseContent?.length - 1]?.videoDuration === ''
    ) {
      toast.error(MESSAGE.FILL_ALL_FIELDS);
    } else {
      setActiveSection(activeSection + 1);
      const newContent = {
        title: '',
        videoUrl: '',
        description: '',
        videoSection: `Chương ${activeSection}`,
        videoDuration: '',
        links: [{ title: '', url: '' }],
        suggestion: ''
      };
      setCourseContent([...courseContent, newContent]);
    }
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleAddCourseContent = () => {
    if (
      courseContent[courseContent?.length - 1]?.title === '' ||
      courseContent[courseContent?.length - 1]?.videoUrl === '' ||
      courseContent[courseContent?.length - 1]?.description === '' ||
      courseContent[courseContent?.length - 1]?.links?.[0]?.title === '' ||
      courseContent[courseContent?.length - 1]?.links?.[0]?.url === '' ||
      courseContent[courseContent?.length - 1]?.videoDuration === ''
    ) {
      toast.error(MESSAGE.FILL_ALL_FIELDS);
    } else {
      setActive(active + 1);
      handleCourseSubmit();
    }
  };
  return (
    <div className="m-auto mt-16 w-[80%] p-3">
      <form onSubmit={handleSubmit}>
        {courseContent?.map((content: any, index: number) => {
          const showSectionInput = index === 0 || content?.videoSection !== courseContent[index - 1]?.videoSection;
          return (
            <>
              <div className={`w-full bg-[#cdc8c817] px-2 py-4 ${showSectionInput ? 'mt-10' : 'mb-0'}`} key={index}>
                {showSectionInput && (
                  <div className="flex w-full items-center gap-8 pb-4">
                    <input
                      type="text"
                      className={`w-min cursor-pointer bg-transparent font-Arimo text-[20px] text-black outline-none dark:text-white`}
                      value={content?.videoSection}
                      onChange={(e) => {
                        const updatedData = [...courseContent];
                        updatedData[index].videoSection = e?.target?.value;
                        setCourseContent(updatedData);
                      }}
                      ref={(el) => {
                        if (focusedInputIndex === index && el) {
                          el.focus(); // Tự động focus khi chỉ mục trùng khớp
                        }
                      }}
                      onBlur={() => {
                        setFocusedInputIndex(null);
                      }}
                    />
                    <BsPencil
                      className="cursor-pointer text-black dark:text-white"
                      onClick={() => {
                        setFocusedInputIndex(index);
                      }}
                      title="Sửa tên chương"
                    />
                  </div>
                )}
                <div
                  className="my-0 flex w-full cursor-pointer items-center justify-between"
                  onClick={() => handleCollapseToggle(index)}
                >
                  {isCollapsed[index] ? (
                    <>
                      {content.title ? (
                        <p className="font-Arimo text-black dark:text-white">
                          {index + 1}. {content?.title}
                        </p>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <div></div>
                  )}
                  {/* arrow button for collasped video content */}
                  <div className="flex items-center">
                    <AiOutlineDelete
                      className={`mr-2 text-[20px] text-black dark:text-white ${index > 0 ? 'cursor-pointer' : 'cursor-no-drop'}`}
                      onClick={() => {
                        if (index > 0) {
                          const updatedData = [...courseContent];
                          updatedData.splice(index, 1);
                          setCourseContent(updatedData);
                        }
                      }}
                      title="Xóa bài học"
                    />
                    <MdOutlineKeyboardArrowUp
                      fontSize="large"
                      className="cursor-pointer text-black dark:text-white"
                      style={{
                        transform: isCollapsed[index] ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                      onClick={() => handleCollapseToggle(index)}
                      title="Mở rộng "
                    />
                  </div>
                </div>
                {!isCollapsed[index] && (
                  <>
                    <div className="my-3">
                      <label htmlFor="" className={styles.label}>
                        Tên bài học
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập tên bài học..."
                        className={styles.input}
                        value={content?.title}
                        onChange={(e) => {
                          const updatedData = courseContent.map((item: any, idx: number) =>
                            idx === index ? { ...item, title: e.target.value } : item
                          );
                          setCourseContent(updatedData);
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className={styles.label}>
                        Đường dẫn video
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập url video... (vd: 8976ac72b190486b9a7be40b8673b7cd)"
                        className={styles.input}
                        value={content?.videoUrl}
                        onChange={(e) => {
                          const updatedData = courseContent.map((item: any, idx: number) =>
                            idx === index ? { ...item, videoUrl: e.target.value } : item
                          );
                          setCourseContent(updatedData);
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className={styles.label}>
                        Độ dài video (phút)
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập độ dài video..."
                        className={styles.input}
                        value={content?.videoDuration}
                        onChange={(e) => {
                          const updatedData = courseContent.map((item: any, idx: number) =>
                            idx === index ? { ...item, videoDuration: e.target.value } : item
                          );
                          setCourseContent(updatedData);
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className={styles.label}>
                        Mô tả bài học
                      </label>
                      <textarea
                        rows={8}
                        cols={30}
                        placeholder="Nhập mô tả cho bài học..."
                        className={`${styles.input} !h-min py-2`}
                        value={content.description}
                        onChange={(e) => {
                          const updatedData = [...courseContent];
                          updatedData[index].description = e.target.value;
                          setCourseContent(updatedData);
                        }}
                      />
                    </div>
                    {// links
                    content?.links?.map((link: any, linkIndex: number) => (
                      <div className="mb-3 block" key={linkIndex}>
                        <div className="flex w-full items-center justify-between">
                          <label htmlFor="" className={styles.label}>
                            Tài liêụ {linkIndex + 1}
                          </label>
                          <AiOutlineDelete
                            className={`${linkIndex === 0 ? 'cursor-no-drop' : 'cursor-pointer'} text-[20px] text-black dark:text-white`}
                            onClick={() => (linkIndex === 0 ? null : handleRemoveLink(index, linkIndex))}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Mô tả tài liệu"
                          className={styles.input}
                          value={link.title}
                          onChange={(e) => {
                            setCourseContent((prevContent: any) => {
                              // Create a deep clone of courseContent
                              const updatedData = prevContent.map((item: any, idx: number) => {
                                if (idx === index) {
                                  return {
                                    ...item,
                                    links: item.links?.map((linkItem: any, lIdx: number) => {
                                      if (lIdx === linkIndex) {
                                        return {
                                          ...linkItem,
                                          title: e.target.value
                                        };
                                      }
                                      return linkItem;
                                    })
                                  };
                                }
                                return item;
                              });
                              return updatedData;
                            });
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Đường dẫn tài liệu"
                          className={styles.input}
                          value={link.url}
                          onChange={(e) => {
                            setCourseContent((prevContent: any) => {
                              // Create a deep clone of courseContent
                              const updatedData = prevContent.map((item: any, idx: number) => {
                                if (idx === index) {
                                  return {
                                    ...item,
                                    links: item.links.map((linkItem: any, lIdx: number) => {
                                      if (lIdx === linkIndex) {
                                        return {
                                          ...linkItem,
                                          url: e.target.value
                                        };
                                      }
                                      return linkItem;
                                    })
                                  };
                                }
                                return item;
                              });
                              return updatedData;
                            });
                          }}
                        />
                      </div>
                    ))}
                    {/* add linl button */}
                    <div className="mb-4 inline-block">
                      <p
                        className="flex cursor-pointer items-center text-[18px] text-black dark:text-white"
                        onClick={() => handleAddLink(index)}
                      >
                        <BsLink45Deg className="mr-2" />
                        Thêm tài liệu mới
                      </p>
                    </div>
                  </>
                )}
                {/* add new content */}
                {index === courseContent.length - 1 && (
                  <div className="pt-8">
                    <p
                      className="flex cursor-pointer items-center text-[18px] text-black dark:text-white"
                      onClick={(e: any) => handleNewCourseContent(content, e)}
                    >
                      <AiOutlinePlusCircle className="mr-2" />
                      Thêm bài học mới
                    </p>
                  </div>
                )}
              </div>
            </>
          );
        })}
        <div
          className="flex cursor-pointer items-center py-4 text-[20px] text-black dark:text-white"
          onClick={() => addNewSection()}
        >
          <AiOutlinePlusCircle className="mr-2" />
          Thêm chương mới
        </div>
      </form>
      <div className="flex w-full items-center justify-between">
        <div
          className="mt-8 flex h-[40px] w-full cursor-pointer items-center justify-center rounded bg-[#37a39a] text-center text-[#fff] 800px:w-[180px]"
          onClick={prevButton}
        >
          Quay lại
        </div>
        <div
          className="mt-8 flex h-[40px] w-full cursor-pointer items-center justify-center rounded bg-[#37a39a] text-center text-[#fff] 800px:w-[180px]"
          onClick={() => handleAddCourseContent()}
        >
          Tiếp theo
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
