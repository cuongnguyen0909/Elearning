'use client';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { styles } from '../../utils/style';
import { useLoginMutation } from '../../../redux/features/auth/authApi';
import toast from 'react-hot-toast';
import Loading from '../../../components/common/Loading';
import { signIn, useSession } from 'next-auth/react';

type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
};

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Please enter your email'),
  password: Yup.string().required('Please enter your password').min(6, 'Password must be at least 6 characters')
});

const Login: React.FC<Props> = (props) => {
  const { setRoute, setOpen } = props;
  const [show, setShow] = useState(false);
  const { data: session } = useSession();
  const [login, { isLoading, isSuccess, error, data }] = useLoginMutation();
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async ({ email, password }) => {
      await login({ email, password });
    }
  });

  useEffect(() => {
    if (isSuccess) {
      const successMessage = 'Đăng nhập thành công';
      toast.success(successMessage, {
        duration: 2000
      });
      setOpen(false);
      window.location.reload();
    }
    if (error) {
      const errorData = error as any;
      const errorMessage = 'Đăng nhập thất bại';
      toast.error(errorMessage, {
        duration: 2000
      });
    }
  }, [isSuccess, error]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      {isLoading && <Loading />}
      <h1 className={`${styles.title}`}>
        Dự án <span className="text-[#2190ff]">ELearning</span>
      </h1>
      <form onSubmit={handleSubmit}>
        {/* email field */}
        <div>
          <label htmlFor="email" className={`${styles.label}`}>
            Email
          </label>
          <input
            type="email"
            name=""
            value={values.email}
            onChange={handleChange}
            id="email"
            placeholder="Nhập email của bạn..."
            className={`${errors.email && touched.email && 'border-red-500'} ${styles.input}`}
          />
        </div>
        {errors.email && touched.email && <span className="block pt-2 text-red-500">{errors.email}</span>}
        {/* password field */}
        <div className="relative mb-1 mt-5 w-full">
          <label htmlFor="password" className={`${styles.label}`}>
            Mật khẩu
          </label>
          <input
            type={`${!show ? 'password' : 'text'}`}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="Nhập mật khẩu của bạn..."
            className={`${errors.password && touched.password && 'border-red-500'} ${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="z-1 absolute bottom-3 right-2 cursor-pointer text-black dark:text-white"
              size={20}
              onClick={() => setShow(!show)}
            />
          ) : (
            <AiOutlineEye
              className="z-1 absolute bottom-3 right-2 cursor-pointer text-black dark:text-white"
              size={20}
              onClick={() => setShow(!show)}
            />
          )}
        </div>
        {errors.password && touched.password && (
          <span className="block pt-2 text-red-500">Vui lòng thử lại mật khẩu của bạn</span>
        )}
        <div className="mt-5 w-full">
          <input type="submit" value="Đăng nhập" className={`${styles.button}`} />
        </div>
        <br />
        <h5 className="pt-4 text-center font-Arimo text-[14px] text-black dark:text-white">Hoặc đăng nhập bằng</h5>
        <div className="flex items-center justify-center">
          <FcGoogle
            size={30}
            className="mr-2 cursor-pointer text-black dark:text-white"
            onClick={() => signIn('google')}
          />
          <AiFillGithub
            size={30}
            className="ml-2 cursor-pointer text-black dark:text-white"
            onClick={() => signIn('github')}
          />
        </div>
        <h5 className="cursor-pointer pt-4 text-center font-Arimo text-black dark:text-white">
          Bạn chưa có tài khoản?{' '}
          <span className="cursor-pointer pl-1 text-[#2190ff]" onClick={() => setRoute('Signup')}>
            Đăng ký ngay
          </span>
        </h5>
      </form>
    </div>
  );
};

export default Login;
