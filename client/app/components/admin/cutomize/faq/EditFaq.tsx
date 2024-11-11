import React, { FC, useState, useEffect } from 'react';
import { useGetHeroDataQuery, useUpdateHeroDataMutation } from '../../../../../redux/features/layout/layoutApi';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { styles } from '../../../../utils/style';
import toast from 'react-hot-toast';

interface EditFaqProps {}

const EditFaq: FC<EditFaqProps> = (props) => {
    const { data, isLoading, refetch } = useGetHeroDataQuery('FAQ', {
        refetchOnMountOrArgChange: true
    });
    const [questions, setQuestions] = useState<any[]>([]);
    const [updateHeroData, { isLoading: isUpdating, isSuccess, error }] = useUpdateHeroDataMutation();
    const toogleQuestion = (id: string) => {
        setQuestions((prev) => prev.map((q) => (q?._id === id ? { ...q, active: !q.active } : q)));
    };

    const handleQuestionChange = (value: string, id: string) => {
        setQuestions((prev) => prev.map((q) => (q?._id === id ? { ...q, question: value } : q)));
    };

    const handleAnswerChange: any = (value: string, id: string) => {
        setQuestions((prev) => prev.map((q) => (q?._id === id ? { ...q, answer: value } : q)));
    };

    const newFaqHandler = () => {
        setQuestions([
            ...questions,
            {
                question: '',
                answer: ''
            }
        ]);
    };

    const areQuestiosUnchanged = (oldQuestions: any[], newQuestions: any[]) => {
        return JSON.stringify(oldQuestions) === JSON.stringify(newQuestions);
    };

    const isAnyQuestionEmpty = (questions: any[]) => {
        return questions.some((q) => q.question === '' || q.answer === '');
    };

    const saveHandler = async () => {
        if (!areQuestiosUnchanged(data?.layout?.faq, questions) && !isAnyQuestionEmpty(questions)) {
            await updateHeroData({ type: 'FAQ', faq: questions });
        }
    };

    useEffect(() => {
        if (data) {
            setQuestions(data.layout.faq);
        }
        if (isSuccess) {
            toast.success('Cập nhật thành công');
            refetch();
        }
        if (error) {
            if ('data' in error) {
                const errorData = error.data as any;
                toast.error(errorData?.data?.message);
            }
        }
    }, [data, isSuccess]);

    return (
        <div className="m-auto mt-[120px] w-[90%] 800px:w-[80%]">
            <div className="mt-12">
                <dl className="space-y-8">
                    {questions?.map((question: any, index: number) => (
                        <div
                            key={index}
                            className={`${question._id !== questions[0]?._id && 'border-t'} border-gray-200 pt-6`}
                        >
                            <dt className="text-lg">
                                <button
                                    className="flex w-full items-start justify-between text-left text-black focus:outline-none dark:text-white"
                                    onClick={() => toogleQuestion(question._id)}
                                >
                                    <input
                                        type="text"
                                        className={`${styles.input} border-none`}
                                        value={question.question}
                                        onChange={(e) => handleQuestionChange(e.target.value, question._id)}
                                        placeholder="Thêm câu hỏi"
                                    />

                                    <span className="ml-6 flex-shrink-0">
                                        {question.active ? (
                                            <HiMinus className="h-6 w-6" />
                                        ) : (
                                            <HiPlus className="h-6 w-6" />
                                        )}{' '}
                                    </span>
                                </button>
                            </dt>
                            {question.active && (
                                <dd className="mt-2 pr-12">
                                    <input
                                        type="text"
                                        className={`${styles.input} border-none`}
                                        value={question.answer}
                                        onChange={(e) => handleAnswerChange(e.target.value, question._id)}
                                        placeholder="Thêm câu trả lời"
                                    />
                                    <span className="ml-6 flex-shrink-0">
                                        <AiOutlineDelete
                                            className="cursor-pointer text-[18px] text-black dark:text-white"
                                            onClick={() => {
                                                setQuestions(questions.filter((q) => q._id !== question._id));
                                            }}
                                        />
                                    </span>
                                </dd>
                            )}
                        </div>
                    ))}
                </dl>
                <br />
                <br />
                <IoMdAddCircleOutline
                    className="cursor-pointer text-[25px] text-black dark:text-white"
                    onClick={newFaqHandler}
                />
            </div>

            <div
                className={`${styles.button} !h-[40px] !min-h-[40px] !w-[100px] bg-[#cccccc34] text-black dark:text-white ${
                    areQuestiosUnchanged(data?.layout?.faq, questions) || isAnyQuestionEmpty(questions)
                        ? '!cursor-not-allowed'
                        : '!cursor-pointer !bg-[#42d383]'
                } absolute bottom-12 right-12 !rounded`}
                onClick={
                    areQuestiosUnchanged(data?.layout?.faq, questions) || isAnyQuestionEmpty(questions)
                        ? () => {}
                        : saveHandler
                }
            >
                Lưu
            </div>
        </div>
    );
};

export default EditFaq;
