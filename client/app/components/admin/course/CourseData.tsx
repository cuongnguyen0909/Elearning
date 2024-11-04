import React, { FC } from 'react';
import { styles } from '../../../utils/style';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import toast from 'react-hot-toast';

interface ICourseDataProps {
    benefits: {
        title: string;
    }[];
    setBenefits: (benefits: { title: string }[]) => void;
    prerequisites: { title: string }[];
    setPrequisites: (prerequisites: { title: string }[]) => void;
    active: number;
    setActive: (active: number) => void;
}

const CourseData: FC<ICourseDataProps> = (props) => {
    const {
        benefits,
        setBenefits,
        prerequisites,
        setPrequisites,
        active,
        setActive
    } = props;

    const handleChangeBenefit = (e: any, index: number, value: any) => {
        const updatedBenefits = [...benefits];
        updatedBenefits[index].title = value;
        setBenefits(updatedBenefits);
    };

    const handleChangePrerequisite = (e: any, index: number, value: any) => {
        const updatedPrerequisites = [...prerequisites];
        updatedPrerequisites[index].title = value;
        setPrequisites(updatedPrerequisites);
    };

    const handleAddNewBenefit = () => {
        setBenefits([...benefits, { title: '' }]);
    };

    const handleRemoveBenefit = () => {
        if (benefits.length > 1) {
            const updatedBenefits = [...benefits];
            updatedBenefits.pop();
            setBenefits(updatedBenefits);
        } else {
            toast.error('You cannot remove this field');
        }
    };

    const handleAddNewPrerequisite = () => {
        setPrequisites([...prerequisites, { title: '' }]);
    };

    const handleRemovePrerequisite = () => {
        if (prerequisites.length > 1) {
            const updatedPrerequisites = [...prerequisites];
            updatedPrerequisites.pop();
            setPrequisites(updatedPrerequisites);
        } else {
            toast.error('You cannot remove this field');
        }
    };

    const prevButton = () => {
        setActive(active - 1);
    };

    const handleOptions = () => {
        if (
            benefits[benefits.length - 1]?.title !== '' &&
            prerequisites[prerequisites.length - 1]?.title !== ''
        ) {
            setActive(active + 1);
        } else {
            toast.error('Please fill all the fields');
        }
    };
    return (
        <div className="m-auto mt-24 block w-[80%]">
            <div>
                <label htmlFor="" className={`${styles.label} text-[20px]`}>
                    What are the benefits of this course?
                </label>
                <br />
                {benefits.map((benefit: any, index: number) => (
                    <input
                        type="text"
                        key={index}
                        name="benefits"
                        placeholder="Benefit"
                        className={`${styles.input} w-full`}
                        value={benefit.title}
                        onChange={(e) =>
                            handleChangeBenefit(e, index, e.target.value)
                        }
                    />
                ))}
                <AddCircleIcon
                    style={{
                        margin: '10px 0px',
                        cursor: 'pointer',
                        width: '30px'
                    }}
                    onClick={handleAddNewBenefit}
                />
                <RemoveCircleIcon
                    style={{
                        margin: '10px 0px',
                        cursor: 'pointer',
                        width: '30px'
                    }}
                    onClick={handleRemoveBenefit}
                />
            </div>
            <div>
                <label htmlFor="" className={`${styles.label} text-[20px]`}>
                    What are the prerequisites of this course?
                </label>
                <br />
                {prerequisites.map((prerequiste: any, index: number) => (
                    <input
                        type="text"
                        key={index}
                        name="prerequisites"
                        placeholder="Prerequisite"
                        className={`${styles.input} w-full`}
                        value={prerequiste.title}
                        onChange={(e) =>
                            handleChangePrerequisite(e, index, e.target.value)
                        }
                    />
                ))}
                <AddCircleIcon
                    style={{
                        margin: '10px 0px',
                        cursor: 'pointer',
                        width: '30px'
                    }}
                    onClick={handleAddNewPrerequisite}
                />
                <RemoveCircleIcon
                    style={{
                        margin: '10px 0px',
                        cursor: 'pointer',
                        width: '30px'
                    }}
                    onClick={handleRemovePrerequisite}
                />
            </div>
            <div className="flex w-full items-center justify-between">
                <div
                    className="mt-8 flex h-[40px] w-full cursor-pointer items-center justify-center rounded bg-[#37a39a] text-center text-[#fff] 800px:w-[180px]"
                    onClick={prevButton}
                >
                    Previous
                </div>
                <div
                    className="mt-8 flex h-[40px] w-full cursor-pointer items-center justify-center rounded bg-[#37a39a] text-center text-[#fff] 800px:w-[180px]"
                    onClick={() => handleOptions()}
                >
                    Next
                </div>
            </div>
        </div>
    );
};

export default CourseData;
