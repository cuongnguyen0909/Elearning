'use client';
import { redirect } from 'next/navigation';
import { FC, use, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from '../../../../../components/common/Loading';
import {
    useCreateCourseMutation,
    useEditCourseMutation,
    useGetAllCoursesQuery
} from '../../../../../redux/features/course/courseApi';
import CourseInfomation from '../components/CourseInfomation';
import CourseData from '../components/CourseData';
import CourseContent from '../components/CourseContent';
import CoursePreview from '../components/CoursePreview';
import CourseOption from '../components/CourseOption';

interface EditCourseProps {
    id: string;
}

const EditCourse: FC<EditCourseProps> = (props) => {
    const { id } = props;
    const { data, refetch } = useGetAllCoursesQuery(
        {},
        {
            refetchOnMountOrArgChange: true
        }
    );
    const [editCourse, { isSuccess, error }] = useEditCourseMutation();
    const editCourseData = data?.courses && data?.courses?.find((course: any) => course?._id === id);
    const [active, setActive] = useState(0);
    const [courseData, setCourseData] = useState({});
    const [courseInfo, setCourseInfo] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        estimatedPrice: '',
        tags: '',
        level: '',
        demoUrl: '',
        thumbnail: ''
    });
    const [benefits, setBenefits] = useState([{ title: '' }]);
    const [prerequisites, setPrerequisites] = useState([{ title: '' }]);
    const [courseContent, setCourseContent] = useState([
        {
            title: '',
            videoUrl: '',
            description: '',
            videoSection: 'Chưa có tiêu đề',
            videoDuration: '',
            links: [
                {
                    title: '',
                    url: ''
                }
            ],
            suggestion: ''
        }
    ]);

    const handleSubmit = async () => {
        //Format benefit array
        const formatedBenefits = benefits.map((benefit: any) => ({
            title: benefit.title
        }));
        //Format prerequisites array
        const formatedPrerequisites = prerequisites.map((prerequisite: any) => ({
            title: prerequisite.title
        }));

        //Format course content array
        const formatedCourseContent = courseContent.map((content: any) => ({
            title: content.title,
            videoUrl: content.videoUrl,
            description: content.description,
            videoSection: content.videoSection,
            videoDuration: content.videoDuration,
            links: content.links?.map((link: any) => ({
                title: link.title,
                url: link.url
            })),
            suggestion: content.suggestion
        }));
        //prepare  object to send to server
        const data = {
            title: courseInfo.title,
            description: courseInfo.description,
            category: courseInfo.category,
            price: courseInfo.price,
            estimatedPrice: courseInfo.estimatedPrice,
            tags: courseInfo.tags,
            level: courseInfo.level,
            demoUrl: courseInfo.demoUrl,
            thumbnail: courseInfo.thumbnail,
            benefits: formatedBenefits,
            prerequisites: formatedPrerequisites,
            contents: formatedCourseContent
        };
        setCourseData(data);
    };
    const handleCourseEdit = async () => {
        const data = courseData;
        await editCourse({
            id: editCourseData?._id,
            data
        });
    };

    useEffect(() => {
        if (editCourseData) {
            setCourseInfo({
                title: editCourseData?.title,
                description: editCourseData?.description,
                category: editCourseData?.category?._id,
                price: editCourseData?.price,
                estimatedPrice: editCourseData?.estimatedPrice,
                tags: editCourseData?.tags,
                level: editCourseData?.level,
                demoUrl: editCourseData?.demoUrl,
                thumbnail: editCourseData?.thumbnail?.url
            });
            setBenefits(editCourseData?.benefits);
            setPrerequisites(editCourseData?.prerequisites);
            setCourseContent(editCourseData?.contents);
        }
    }, [editCourseData]);
    useEffect(() => {
        if (isSuccess) {
            toast.success('Cập nhật khóa học thành công');
            redirect('/admin/course/all');
        }
        if (error) {
            if ('data' in error) {
                const err = error as any;
                toast.error(err.data.message);
            }
        }
    }, [isSuccess, error]);
    return (
        <div className="flex min-h-screen w-full">
            {/* {isLoading && <Loading />} */}
            <div className="w-[80%]">
                {active === 0 && (
                    <CourseInfomation
                        courseInfo={courseInfo}
                        setCourseInfo={setCourseInfo}
                        active={active}
                        setActive={setActive}
                        isEdit={true}
                    />
                )}
                {active === 1 && (
                    <CourseData
                        benefits={benefits}
                        setBenefits={setBenefits}
                        prerequisites={prerequisites}
                        setPrequisites={setPrerequisites}
                        active={active}
                        setActive={setActive}
                    />
                )}
                {active === 2 && (
                    <CourseContent
                        active={active}
                        setActive={setActive}
                        courseContent={courseContent}
                        setCourseContent={setCourseContent}
                        handleSubmit={handleSubmit}
                    />
                )}
                {active === 3 && (
                    <CoursePreview
                        active={active}
                        setActive={setActive}
                        courseData={courseData}
                        handleCourseCreate={() => {}}
                        handleCourseEdit={handleCourseEdit}
                        isEdit={true}
                    />
                )}
            </div>
            <div className="top-18 fixed right-0 z-[1] mt-[100px] h-screen w-[20%]">
                <CourseOption
                    active={active}
                    setActive={setActive}
                    courseInfo={courseInfo}
                    benefits={benefits}
                    prerequisites={prerequisites}
                    courseContent={courseContent}
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default EditCourse;
