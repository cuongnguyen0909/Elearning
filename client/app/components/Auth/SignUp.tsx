'use client';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { styles } from '../../utils/style';
import { useRegisterMutation } from '../../../redux/features/auth/authApi';
import toast from 'react-hot-toast';
import Loading from '../../../components/common/Loading';
type Props = {
  setRoute: (route: string) => void;
};

const signUpSchema = Yup.object().shape({
  name: Yup.string().required('Tên người dùng không được để trống. Vui lòng nhập tên người dùng'),
  email: Yup.string()
    .email('Email không hợp lệ. Vui lòng thử lại')
    .required('Email không được để trống. Vui lòng nhập email'),
  password: Yup.string()
    .required(' Mật khẩu không được để trống. Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải chứa ít nhất 6 ký tự'),
  confirmPassword: Yup.string()
    .required(' Mật khẩu không được để trống. Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải chứa ít nhất 6 ký tự')
    .oneOf([Yup.ref('password'), ''], 'Mật khẩu không khớp')
});

const SignUp: React.FC<Props> = (props) => {
  const { setRoute } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [register, { data, isLoading, error, isSuccess }] = useRegisterMutation();
  useEffect(() => {
    if (isSuccess) {
      const message = 'Đăng ký thành công';
      toast.success(message);
      setRoute('Verification');
    }
    if (error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message);
    }
  }, [isSuccess, error]);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema: signUpSchema,
    onSubmit: async ({ name, email, password }) => {
      const data: any = {
        name,
        email,
        password
      };
      await register(data);
      // redirect to verification page
    }
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      {isLoading && <Loading />}
      <h1 className={`${styles.title}`}>
        Đăng ký tài khoản
        <span className="text-[#2190ff]"> Edemy</span>
      </h1>
      <form onSubmit={handleSubmit}>
        {/* name field */}
        <div>
          <label htmlFor="name" className={`${styles.label}`}>
            Tên
          </label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="Nhập tên của bạn..."
            className={`${errors.name && touched.name && 'border-red-500'} ${styles.input}`}
          />
        </div>
        {errors.name && touched.name && <span className="block pt-2 font-semibold text-red-500">{errors.name}</span>}
        {/* email field */}
        <div className="mt-5">
          <label htmlFor="email" className={`${styles.label}`}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            id="email"
            placeholder="Nhập email của bạn..."
            className={`${errors.email && touched.email && 'border-red-500'} ${styles.input}`}
          />
        </div>
        {errors.email && touched.email && <span className="block pt-2 font-semibold text-red-500">{errors.email}</span>}
        {/* password field */}
        <div className="relative mb-1 mt-5 w-full">
          <label htmlFor="password" className={`${styles.label}`}>
            Mật khẩu
          </label>
          <input
            type={`${!showPassword ? 'password' : 'text'}`}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="Mật khẩu phải chứa ít nhất 6 ký tự..."
            className={`${errors.password && touched.password && 'border-red-500'} ${styles.input}`}
          />
          {!showPassword ? (
            <AiOutlineEyeInvisible
              className="z-1 absolute bottom-3 right-2 cursor-pointer text-black dark:text-white"
              size={20}
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <AiOutlineEye
              className="z-1 absolute bottom-3 right-2 cursor-pointer text-black dark:text-white"
              size={20}
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </div>
        {errors.password && touched.password && (
          <span className="block pt-2 font-semibold text-red-500">{errors.password}</span>
        )}
        {/* password field */}
        <div className="relative mb-1 mt-5 w-full">
          <label htmlFor="confirmPassword" className={`${styles.label}`}>
            Xác nhận mật khẩu
          </label>
          <input
            type={`${!showConfirmPassword ? 'password' : 'text'}`}
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            id="confirmPassword"
            placeholder="Mật khẩu phải chứa ít nhất 6 ký tự..."
            className={`${errors.password && touched.password && 'border-red-500'} ${styles.input}`}
          />
          {!showConfirmPassword ? (
            <AiOutlineEyeInvisible
              className="z-1 absolute bottom-3 right-2 cursor-pointer text-black dark:text-white"
              size={20}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          ) : (
            <AiOutlineEye
              className="z-1 absolute bottom-3 right-2 cursor-pointer text-black dark:text-white"
              size={20}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          )}
        </div>
        {errors.confirmPassword && touched.confirmPassword && (
          <span className="block pt-2 font-semibold text-red-500">{errors.confirmPassword}</span>
        )}
        {/* button submit */}
        <div className="mt-5 w-full">
          <input type="submit" value="Đăng ký" className={`${styles.button}`} />
        </div>
        <br />
        <h5 className="font-Arimo pt-4 text-center text-[14px] text-black dark:text-white">Hoặc đăng nhập với</h5>
        <div className="flex items-center justify-center">
          <FcGoogle size={30} className="mr-2 cursor-pointer text-black dark:text-white" />
          <AiFillGithub size={30} className="ml-2 cursor-pointer text-black dark:text-white" />
        </div>
        <h5 className="font-Arimo cursor-pointer pt-4 text-center text-black dark:text-white">
          Nếu bạn đã có tài khoản?{' '}
          <span className="cursor-pointer pl-1 text-[#2190ff]" onClick={() => setRoute('Login')}>
            Đăng nhập ngay
          </span>
        </h5>
      </form>
    </div>
  );
};

export default SignUp;
