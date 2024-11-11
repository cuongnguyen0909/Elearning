import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineDelete, AiOutlinePlusCircle } from 'react-icons/ai';
import { BsLink45Deg, BsPencil } from 'react-icons/bs';
import { MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { styles } from '../../../../utils/style';
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
            content?.links?.[0]?.url === ''
        ) {
            toast.error('Please fill all the fields');
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
            courseContent[courseContent?.length - 1]?.links?.[0]?.url === ''
        ) {
            toast.error('Please fill all the fields');
        } else {
            setActiveSection(activeSection + 1);
            const newContent = {
                title: '',
                videoUrl: '',
                description: '',
                videoSection: `Untitled Section ${activeSection}`,
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
            courseContent[courseContent?.length - 1]?.links?.[0]?.url === ''
        ) {
            toast.error('Please fill all the fields');
        } else {
            setActive(active + 1);
            handleCourseSubmit();
        }
    };
    return (
        <div className="m-auto mt-16 w-[80%] p-3">
            <form onSubmit={handleSubmit}>
                {courseContent?.map((content: any, index: number) => {
                    const showSectionInput =
                        index === 0 || content?.videoSection !== courseContent[index - 1]?.videoSection;
                    return (
                        <>
                            <div
                                className={`w-full bg-[#cdc8c817] px-2 py-4 ${showSectionInput ? 'mt-10' : 'mb-0'}`}
                                key={index}
                            >
                                {showSectionInput && (
                                    <div className="flex w-full items-center pb-4">
                                        <input
                                            type="text"
                                            className={`w-min cursor-pointer bg-transparent font-Poppins text-[20px] text-black outline-none dark:text-white`}
                                            value={content?.videoSection}
                                            onChange={(e) => {
                                                const updatedData = [...courseContent];
                                                updatedData[index].videoSection = e?.target?.value;
                                                setCourseContent(updatedData);
                                            }}
                                        />
                                        <BsPencil className="cursor-pointer text-black dark:text-white" />
                                        <br />
                                    </div>
                                )}
                                <div className="my-0 flex w-full items-center justify-between">
                                    {isCollapsed[index] ? (
                                        <>
                                            {content.title ? (
                                                <p className="font-Poppins text-black dark:text-white">
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
                                        />
                                        <MdOutlineKeyboardArrowUp
                                            fontSize="large"
                                            className="cursor-pointer text-black dark:text-white"
                                            style={{
                                                transform: isCollapsed[index] ? 'rotate(180deg)' : 'rotate(0deg)'
                                            }}
                                            onClick={() => handleCollapseToggle(index)}
                                        />
                                    </div>
                                </div>
                                {!isCollapsed[index] && (
                                    <>
                                        <div className="my-3">
                                            <label htmlFor="" className={styles.label}>
                                                Video Title
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter video title..."
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
                                                Video Url
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter video url..."
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
                                                Video Description
                                            </label>
                                            <textarea
                                                rows={8}
                                                cols={30}
                                                placeholder="Enter video description..."
                                                className={`${styles.input} !h-min py-2`}
                                                value={content.description}
                                                onChange={(e) => {
                                                    const updatedData = [...courseContent];
                                                    updatedData[index].description = e.target.value;
                                                    setCourseContent(updatedData);
                                                }}
                                            />
                                            <br />
                                        </div>
                                        {// links
                                        content?.links?.map((link: any, linkIndex: number) => (
                                            <div className="mb-3 block" key={linkIndex}>
                                                <div className="flex w-full items-center justify-between">
                                                    <label htmlFor="" className={styles.label}>
                                                        Links {linkIndex + 1}
                                                    </label>
                                                    <AiOutlineDelete
                                                        className={`${linkIndex === 0 ? 'cursor-no-drop' : 'cursor-pointer'} text-[20px] text-black dark:text-white`}
                                                        onClick={() =>
                                                            linkIndex === 0 ? null : handleRemoveLink(index, linkIndex)
                                                        }
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Link title"
                                                    className={styles.input}
                                                    value={link.title}
                                                    onChange={(e) => {
                                                        setCourseContent((prevContent: any) => {
                                                            // Create a deep clone of courseContent
                                                            const updatedData = prevContent.map(
                                                                (item: any, idx: number) => {
                                                                    if (idx === index) {
                                                                        return {
                                                                            ...item,
                                                                            links: item.links?.map(
                                                                                (linkItem: any, lIdx: number) => {
                                                                                    if (lIdx === linkIndex) {
                                                                                        return {
                                                                                            ...linkItem,
                                                                                            title: e.target.value
                                                                                        };
                                                                                    }
                                                                                    return linkItem;
                                                                                }
                                                                            )
                                                                        };
                                                                    }
                                                                    return item;
                                                                }
                                                            );
                                                            return updatedData;
                                                        });
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Link Url"
                                                    className={styles.input}
                                                    value={link.url}
                                                    onChange={(e) => {
                                                        setCourseContent((prevContent: any) => {
                                                            // Create a deep clone of courseContent
                                                            const updatedData = prevContent.map(
                                                                (item: any, idx: number) => {
                                                                    if (idx === index) {
                                                                        return {
                                                                            ...item,
                                                                            links: item.links.map(
                                                                                (linkItem: any, lIdx: number) => {
                                                                                    if (lIdx === linkIndex) {
                                                                                        return {
                                                                                            ...linkItem,
                                                                                            url: e.target.value
                                                                                        };
                                                                                    }
                                                                                    return linkItem;
                                                                                }
                                                                            )
                                                                        };
                                                                    }
                                                                    return item;
                                                                }
                                                            );
                                                            return updatedData;
                                                        });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                        <br />
                                        {/* add linl button */}
                                        <div className="mb-4 inline-block">
                                            <p
                                                className="flex cursor-pointer items-center text-[18px] text-black dark:text-white"
                                                onClick={() => handleAddLink(index)}
                                            >
                                                <BsLink45Deg className="mr-2" />
                                                Add Link
                                            </p>
                                        </div>
                                    </>
                                )}
                                <br />
                                {/* add new content */}
                                {index === courseContent.length - 1 && (
                                    <div>
                                        <p
                                            className="flex cursor-pointer items-center text-[18px] text-black dark:text-white"
                                            onClick={(e: any) => handleNewCourseContent(content, e)}
                                        >
                                            <AiOutlinePlusCircle className="mr-2" />
                                            Add New Content
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    );
                })}
                <br />
                <div
                    className="flex cursor-pointer items-center text-[20px] text-black dark:text-white"
                    onClick={() => addNewSection()}
                >
                    <AiOutlinePlusCircle className="mr-2" />
                    Add New Section
                </div>
            </form>
            <div className="flex w-full items-center justify-between">
                <div
                    className="mt-8 flex h-[40px] w-full cursor-pointer items-center justify-center rounded bg-[#37a39a] text-center text-[#fff] 800px:w-[180px]"
                    onClick={prevButton}
                >
                    Previous
                </div>
                <div
                    className="mt-8 flex h-[40px] w-full cursor-pointer items-center justify-center rounded bg-[#37a39a] text-center text-[#fff] 800px:w-[180px]"
                    onClick={() => handleAddCourseContent()}
                >
                    Next
                </div>
            </div>
            <br />
            <br />
            <br />
        </div>
    );
};

export default CourseContent;
