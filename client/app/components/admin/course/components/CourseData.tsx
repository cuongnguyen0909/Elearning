import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { FC } from 'react';
import toast from 'react-hot-toast';
import { styles } from '../../../../utils/style';
import { MESSAGE } from '../../../../constants/enum';

interface CourseDataProps {
    benefits: {
        title: string;
    }[];
    setBenefits: (benefits: { title: string }[]) => void;
    prerequisites: { title: string }[];
    setPrequisites: (prerequisites: { title: string }[]) => void;
    active: number;
    setActive: (active: number) => void;
}

const CourseData: FC<CourseDataProps> = (props) => {
    const { benefits, setBenefits, prerequisites, setPrequisites, active, setActive } = props;

    const handleChangeBenefit = (e: any, index: number, value: any) => {
        const updatedBenefits = benefits.map((benefit, i) => (i === index ? { ...benefit, title: value } : benefit));
        setBenefits(updatedBenefits);
    };

    const handleChangePrerequisite = (e: any, index: number, value: any) => {
        const updatedPrerequisites = prerequisites.map((prerequisite, i) =>
            i === index ? { ...prerequisite, title: value } : prerequisite
        );
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
            toast.error(MESSAGE.CAN_NOT_REMOVE);
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
            toast.error(MESSAGE.CAN_NOT_REMOVE);
        }
    };

    const prevButton = () => {
        setActive(active - 1);
    };

    const handleOptions = () => {
        if (benefits[benefits.length - 1]?.title !== '' && prerequisites[prerequisites.length - 1]?.title !== '') {
            setActive(active + 1);
        } else {
            toast.error(MESSAGE.FILL_ALL_FIELDS);
        }
    };
    return (
        <div className="m-auto mt-24 block w-[80%]">
            <div>
                <label htmlFor="" className={`${styles.label} text-[20px]`}>
                    Quyền lợi khi học khóa học này?
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
                        onChange={(e) => handleChangeBenefit(e, index, e.target.value)}
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
                    Một số yêu cầu cần thiết trước khi học khóa học này
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
                        onChange={(e) => handleChangePrerequisite(e, index, e.target.value)}
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
                    Quay lại
                </div>
                <div
                    className="mt-8 flex h-[40px] w-full cursor-pointer items-center justify-center rounded bg-[#37a39a] text-center text-[#fff] 800px:w-[180px]"
                    onClick={() => handleOptions()}
                >
                    Tiếp theo
                </div>
            </div>
        </div>
    );
};

export default CourseData;
