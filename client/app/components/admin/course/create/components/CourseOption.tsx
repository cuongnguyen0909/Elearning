import React, { FC, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { IoMdCheckmark } from 'react-icons/io';

interface CourseOptionProps {
    active: number;
    setActive: (index: number) => void;
    courseInfo: any;
    benefits: any;
    prerequisites: any;
    courseContent: any;
    handleSubmit: () => void;
}

const CourseOption: FC<CourseOptionProps> = (props) => {
    const { active, setActive, courseInfo, courseContent, benefits, prerequisites, handleSubmit } = props;
    // const options = ['Course Information', 'Course Options', 'Course Content', 'Course Preview'];
    const options = [
        {
            value: 'Tổng quan khóa học',
            active: 0
        },
        {
            value: 'Lợi ích và yêu cầu',
            active: 1
        },
        {
            value: 'Chi tiết khóa học',
            active: 2
        },
        {
            value: 'Xem trước khóa học',
            active: 3
        }
    ];
    console.log(courseContent);

    const handleChangeActiveOption = async (e: any, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (index > active) {
            switch (index) {
                case 1:
                    if (
                        courseInfo?.title === '' ||
                        courseInfo?.description === '' ||
                        courseInfo?.price === '' ||
                        courseInfo?.estimatedPrice === '' ||
                        courseInfo?.tags === '' ||
                        courseInfo?.level === '' ||
                        courseInfo?.demoUrl === '' ||
                        courseInfo?.thumbnail === ''
                    ) {
                        return toast.error('Please fill all the fields');
                    } else {
                        setActive(index);
                    }
                    break;
                case 2:
                    for (let i = 0; i < benefits.length; i++) {
                        if (benefits[i]?.title === '') {
                            return toast.error('Please fill all the fields');
                        } else {
                            setActive(index);
                        }
                    }

                    for (let i = 0; i < prerequisites.length; i++) {
                        if (prerequisites[i]?.title === '') {
                            return toast.error('Please fill all the fields');
                        } else {
                            //handleSubmit();
                            await handleSubmit();
                            setActive(index);
                        }
                    }
                    break;
                case 3:
                    for (let i = 0; i < courseContent.length; i++) {
                        if (
                            courseContent[i]?.title === '' ||
                            courseContent[i]?.description === '' ||
                            courseContent[i]?.duration === '' ||
                            courseContent[i]?.videoUrl === '' ||
                            courseContent[i]?.videoSection === ''
                        ) {
                            return toast.error('Please fill all the fields');
                        } else {
                            setActive(index);
                        }
                    }
                    break;
                default:
                    break;
            }
        } else {
            setActive(index);
        }
    };
    return (
        <div>
            {options.map((option: any, index: number) => (
                <div key={index} className="flex w-full py-5">
                    <div
                        className={`flex h-[35px] w-[35px] items-center justify-center rounded-full ${active + 1 > index ? 'bg-blue-500' : 'bg-[#384766]'} relative cursor-pointer`}
                        onClick={(e) => handleChangeActiveOption(e, index)}
                    >
                        <IoMdCheckmark />
                        {index !== options.length - 1 && (
                            <div
                                className={`absolute h-[30px] w-1 ${active + 1 > index ? 'bg-blue-500' : 'bg-[#384766]'} bottom-[-100%]`}
                            />
                        )}
                    </div>
                    <h5
                        className={`pl-3 ${active === index ? 'text-black dark:text-white' : 'text-black dark:text-white'} cursor-pointer text-[20px]`}
                        onClick={(e) => handleChangeActiveOption(e, index)}
                    >
                        {option.value}
                    </h5>
                </div>
            ))}
        </div>
    );
};

export default CourseOption;
