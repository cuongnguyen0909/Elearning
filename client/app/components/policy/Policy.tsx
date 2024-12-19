import React, { FC } from 'react';

interface PolicyProps {}

const Policy: FC<PolicyProps> = () => {
  return (
    <div className="min-h-screen rounded-lg bg-white p-8 text-gray-800 shadow-lg dark:bg-gray-900 dark:text-gray-200">
      <h1 className="mb-6 text-center text-3xl font-extrabold text-red-600 dark:text-red-400">
        Chính sách sử dụng
        <span className="mt-2 block text-xl font-medium text-gray-600 dark:text-gray-400">
          Quyền và trách nhiệm khi tham gia Edemy
        </span>
      </h1>
      <p className="text-lg leading-relaxed">
        Cảm ơn bạn đã tin tưởng và lựa chọn Edemy là nền tảng học trực tuyến của mình. Để đảm bảo môi trường học tập
        chuyên nghiệp, hiệu quả và an toàn cho tất cả người dùng, chúng tôi đã xây dựng một số chính sách sử dụng mà mọi
        thành viên cần tuân thủ.
      </p>
      <h2 className="mt-6 text-2xl font-bold text-gray-700 dark:text-gray-300">Quy định cơ bản</h2>
      <ul className="mt-4 list-inside list-disc text-lg leading-relaxed">
        <li>Người dùng cần cung cấp thông tin cá nhân chính xác và tuân thủ quy định bảo mật tài khoản.</li>
        <li>
          Tuyệt đối không phát tán, chia sẻ nội dung khóa học hoặc tài khoản của bạn cho người khác nếu không được sự
          đồng ý từ Edemy.
        </li>
        <li>
          Nội dung khóa học trên Edemy được bảo vệ bởi luật bản quyền. Mọi hành vi sao chép, phân phối hoặc sử dụng trái
          phép đều bị nghiêm cấm.
        </li>
      </ul>
      <h2 className="mt-6 text-2xl font-bold text-gray-700 dark:text-gray-300">Cam kết từ Edemy</h2>
      <p className="mt-4 text-lg leading-relaxed">
        Chúng tôi cam kết cung cấp nội dung chất lượng, hỗ trợ người học một cách tận tâm và đảm bảo quyền lợi hợp pháp
        của tất cả người dùng. Đội ngũ Edemy luôn sẵn sàng giải quyết mọi thắc mắc hoặc vấn đề mà bạn gặp phải trong quá
        trình sử dụng nền tảng.
      </p>
      <p className="mt-6 text-center text-lg font-medium">
        <span className="text-red-600 dark:text-red-400">Edemy</span> - Học tập dễ dàng, an toàn và hiệu quả.
      </p>
    </div>
  );
};

export default Policy;
