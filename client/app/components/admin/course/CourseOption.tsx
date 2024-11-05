import React, { FC, useState, useEffect } from 'react';
import { IoMdCheckmark } from 'react-icons/io';

interface CourseOptionProps {
    active: number;
    setActive: (index: number) => void;
}

const CourseOption: FC<CourseOptionProps> = (props) => {
    const { active, setActive } = props;
    const options = ['Course Information', 'Course Options', 'Course Content', 'Course Preview'];
    return (
        <div>
            {options.map((option: any, index: number) => (
                <div key={index} className="flex w-full py-5">
                    <div
                        className={`flex h-[35px] w-[35px] items-center justify-center rounded-full ${active + 1 > index ? 'bg-blue-500' : 'bg-[#384766]'} relative`}
                    >
                        <IoMdCheckmark />
                        {index !== options.length - 1 && (
                            <div
                                className={`absolute h-[30px] w-1 ${active + 1 > index ? 'bg-blue-500' : 'bg-[#384766]'} bottom-[-100%]`}
                            />
                        )}
                    </div>
                    <h5
                        className={`pl-3 ${active === index ? 'text-black dark:text-white' : 'text-black dark:text-white'} text-[20px]`}
                    >
                        {option}
                    </h5>
                </div>
            ))}
        </div>
    );
};

export default CourseOption;
