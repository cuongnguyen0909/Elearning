import React, { FC, useEffect, useState } from 'react';
import { useGetHeroDataQuery } from '../../../redux/features/layout/layoutApi';
import { HiMinus, HiPlus } from 'react-icons/hi';

interface FAQProps {}

const FAQ: FC<FAQProps> = (props) => {
  const { data, isLoading } = useGetHeroDataQuery('FAQ', {
    refetchOnMountOrArgChange: true
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<any>(null);

  useEffect(() => {
    if (data) {
      setQuestions(data?.layout?.faq);
    }
  }, [data]);

  const toggelQuestion = (id: any) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };
  return (
    <div>
      <div className="font-Arimo p-24 text-center text-[25px] font-[700] leading-[35px] tracking-tight text-[#000] dark:text-white sm:text-3xl 800px:!leading-[60px] lg:text-4xl">
        <h1>Những câu hỏi thường gặp </h1>
        <div className="mt-12">
          <dl className="space-y-10">
            {questions?.map((q: any, index: number) => (
              <div key={index} className={`${q?._id !== questions[0]?._id && 'border-t pt-6'} border-gray-200`}>
                <dt className="text-lg">
                  <button
                    className="flex w-full items-start justify-between text-left focus:outline-none"
                    onClick={() => toggelQuestion(q?._id)}
                  >
                    <span className="font-medium text-black dark:text-white">{q?.question}</span>
                    <span className="ml-6 flex-shrink-0">
                      {activeQuestion === q?._id ? (
                        <HiMinus className="h-6 w-6 text-black dark:text-white" />
                      ) : (
                        <HiPlus className="h-6 w-6 text-black dark:text-white" />
                      )}
                    </span>
                  </button>
                </dt>
                {activeQuestion === q?._id && (
                  <dd className="mt-2 pr-12">
                    <p className="font-Arimo !text-start text-base font-normal text-black dark:text-white">
                      {q?.answer}
                    </p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
