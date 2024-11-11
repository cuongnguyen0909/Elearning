import React, { FC } from 'react';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import CoursePlayer from './CoursePlayer';
import { styles } from '../../../../utils/style';
import Rating from '../../../../../components/rating/Rating';

interface CoursePreviewProps {
    active: number;
    setActive: (active: number) => void;
    courseData: any;
    handleCourseCreate: any;
    isEdit: boolean;
    handleCourseEdit: any;
}

const CoursePreview: FC<CoursePreviewProps> = (props) => {
    const { active, setActive, courseData, handleCourseCreate, handleCourseEdit, isEdit } = props;
    const discountPercentage = ((courseData?.estimatedPrice - courseData?.price) / courseData?.estimatedPrice) * 100;
    const discountPercentagePrice = discountPercentage.toFixed(0);
    const prevButton = () => {
        setActive(active - 1);
    };
    const createCourseFinally = () => {
        handleCourseCreate();
    };
    const editCourseFinally = () => {
        handleCourseEdit();
    };
    return (
        <div className="m-auto mb-5 w-[90%] py-5 800px:w-[90%]">
            <div className="relative w-full">
                <div className="mt-10 w-full">
                    <CoursePlayer videoUrl={courseData.demoUrl} title={courseData.title} />
                    <h1 className="font-Poppins text-[25px] font-[600]">{courseData?.title}</h1>
                </div>
                <div className="flex items-center">
                    <h3 className="pt-5 text-[25px]">
                        <strong>{courseData?.price === 0 ? 'Free' : `$${courseData?.price}`}</strong>
                    </h3>
                    <h5 className="mt-2 pl-3 text-[20px] line-through opacity-80">${courseData?.estimatedPrice}</h5>
                    <h4 className="pl-5 pt-4 text-[22px]">
                        <i>({discountPercentagePrice}% Off)</i>
                    </h4>
                </div>
                <div className="flex items-center">
                    <div
                        className={`${styles.button} my-3 !w-[180px] flex-[1%] cursor-not-allowed !bg-[crimson] font-Poppins`}
                    >
                        Mua ngay {courseData?.price === 0 ? 'Free' : `$${courseData?.price}`}
                    </div>
                    <div className="flex flex-[65%] items-center">
                        <input
                            type="text"
                            name=""
                            id=""
                            placeholder="Nhập mã giảm giá..."
                            className={`${styles.input} !mt-0 ml-3 1100px:w-[60%] 1500px:!w-[50%]`}
                        />
                        <div className={`${styles.button} my-3 ml-4 !w-[120px] cursor-pointer font-Poppins`}>
                            Áp dụng
                        </div>
                    </div>
                </div>
                <br />
                <div>
                    <p className="pb-1">
                        • <strong>30 ngày hoàn tiền - Đảm bảo hài lòng 100% - Không có câu hỏi nào</strong>
                    </p>
                    <p className="pb-1">
                        • <strong>Chứng chỉ hoàn thành khóa học - tuyển dụng được - truy cập trọn đời</strong>
                    </p>
                    <p className="pb-1">
                        • <strong>Truy cập trọn đời vào tất cả các khóa học trên trang web và ứng dụng di động</strong>
                    </p>
                    <p className="pb-3 800px:pb-1">
                        •{' '}
                        <strong>
                            Học theo lịch của bạn - học bất cứ khi nào, ở bất cứ đâu - trên máy tính bảng hoặc điện
                            thoại
                        </strong>
                    </p>
                </div>
            </div>
            <br />
            <div className="w-full">
                <div className="w-full 800px:pr-5">
                    <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center justify-between">
                            <Rating rating={4.5} />
                            <h5>0 Đánh giá</h5>
                            {/* <h5>0 Students</h5> */}
                        </div>
                    </div>
                    <br />
                    <h1 className="font-Poppins text-[25px] font-[600]">
                        Quyền lợi của khóa học <span className="text-[#f6b100]">*</span>
                    </h1>
                </div>
                {/* benefits */}
                {courseData?.benefits?.map((benefit: any, index: number) => (
                    <div className="flex w-full py-2 800px:items-center" key={index}>
                        <div>
                            <IoCheckmarkDoneOutline size={20} color="#f6b100" />
                        </div>
                        <p className="pl-2">{benefit.title}</p>
                    </div>
                ))}
                <br />
                {/* prerequisites  */}
                <h2 className="font-Poppins text-[25px] font-[600]">
                    Yêu cầu cần thiết trước khi học khóa học <span className="text-[#f6b100]">*</span>
                </h2>
                {courseData?.prerequisites?.map((prerequisite: any, index: number) => (
                    <div className="flex w-full py-2 800px:items-center" key={index}>
                        <div>
                            <IoCheckmarkDoneOutline size={20} color="#f6b100" />
                        </div>
                        <p className="pl-2">{prerequisite.title}</p>
                    </div>
                ))}
                <br />
                <br />
                {/* course description */}
                <div className="w-full">
                    <h2 className="font-Poppins text-[25px] font-[600]">
                        Mô tả khóa học <span className="text-[#f6b100]">*</span>
                    </h2>
                    <p className="mt-[20px] w-full overflow-hidden whitespace-pre-line text-[18px]">
                        {courseData?.description}
                    </p>
                </div>
                <br />
                <br />
                {/* finally create course */}
                <div className="flex w-full items-center justify-between">
                    <div
                        className="mt-8 flex h-[40px] w-full cursor-pointer items-center justify-center rounded bg-[#37a39a] text-center text-[#fff] 800px:w-[180px]"
                        onClick={() => prevButton()}
                    >
                        Quay lại
                    </div>
                    <div
                        className="mt-8 flex h-[40px] w-full cursor-pointer items-center justify-center rounded bg-[#37a39a] text-center text-[#fff] 800px:w-[180px]"
                        onClick={() => (isEdit ? editCourseFinally() : createCourseFinally())}
                    >
                        {isEdit ? 'Cập nhật khóa học' : 'Tạo khóa học'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePreview;
