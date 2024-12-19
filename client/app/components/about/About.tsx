import React, { FC } from 'react';

interface AboutProps {}

const About: FC<AboutProps> = () => {
  return (
    <div className="min-h-screen rounded-lg bg-white p-8 text-gray-800 shadow-lg dark:bg-gray-900 dark:text-gray-200">
      <h1 className="mb-6 text-center text-3xl font-extrabold text-blue-600 dark:text-blue-400">
        Chào mừng đến với Edemy
        <span className="mt-2 block text-xl font-medium text-gray-600 dark:text-gray-400">
          Nền tảng học trực tuyến qua video hàng đầu
        </span>
      </h1>
      <p className="text-lg leading-relaxed">
        Edemy là nơi bạn có thể học tập, phát triển kỹ năng và khám phá tri thức mới một cách dễ dàng và linh hoạt.
        Chúng tôi cung cấp hàng trăm khóa học từ cơ bản đến nâng cao, được biên soạn bởi những chuyên gia hàng đầu trong
        nhiều lĩnh vực như công nghệ, kinh doanh, thiết kế, ngôn ngữ, và nhiều hơn nữa.
      </p>
      <p className="mt-4 text-lg leading-relaxed">
        Tại Edemy, chúng tôi tin rằng việc học không chỉ là một nhiệm vụ, mà còn là một hành trình thú vị. Bằng cách sử
        dụng công nghệ hiện đại, các khóa học của chúng tôi được thiết kế để tương tác, dễ hiểu và có thể áp dụng ngay
        trong thực tế.
      </p>
      <p className="mt-4 text-lg leading-relaxed">
        Với Edemy, bạn có thể học mọi lúc, mọi nơi, trên bất kỳ thiết bị nào. Chúng tôi cam kết mang lại trải nghiệm học
        tập tốt nhất để bạn không ngừng tiến bộ và đạt được mục tiêu của mình.
      </p>
      <p className="mt-6 text-center text-lg font-medium">
        <span className="text-blue-600 dark:text-blue-400">Edemy</span> - Đưa tri thức đến gần hơn với bạn.
      </p>
    </div>
  );
};

export default About;
