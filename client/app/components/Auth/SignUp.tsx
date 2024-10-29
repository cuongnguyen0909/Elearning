'use client';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    AiOutlineEye,
    AiOutlineEyeInvisible,
    AiFillGithub
} from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { styles } from '../../utils/style';
import { useRegisterMutation } from '../../../redux/features/auth/authApi';
import toast from 'react-hot-toast';
import Loading from '../../../components/common/Loading';
type Props = {
    setRoute: (route: string) => void;
};

const signUpSchema = Yup.object().shape({
    name: Yup.string().required('Please enter your name'),
    email: Yup.string()
        .email('Invalid email')
        .required('Please enter your email'),
    password: Yup.string()
        .required('Please enter your password')
        .min(6, 'Password must be at least 6 characters')
});

const SignUp: React.FC<Props> = (props) => {
    const { setRoute } = props;
    const [show, setShow] = useState(false);
    const [register, { data, isLoading, error, isSuccess }] =
        useRegisterMutation();
    useEffect(() => {
        if (isSuccess) {
            const message = data?.message || 'User registered successfully';
            toast.success(message);
            setRoute('Verification');
        }
        if (error) {
            const errorData = error as any;
            toast.error(errorData?.data?.message);
        }
    }, [isSuccess, error]);

    const formik = useFormik({
        initialValues: { name: '', email: '', password: '' },
        validationSchema: signUpSchema,
        onSubmit: async ({ name, email, password }) => {
            const data: any = {
                name,
                email,
                password
            };
            await register(data);
        }
    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <>
            <div className="w-full">
                {isLoading && <Loading isLoading={isLoading} />}
            </div>
            <div className="w-full">
                <h1 className={`${styles.title}`}>Join to ELearning</h1>
                <form onSubmit={handleSubmit}>
                    {/* name field */}
                    <div>
                        <label htmlFor="name" className={`${styles.label}`}>
                            Enter your name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            id="name"
                            placeholder="Enter your name"
                            className={`${errors.name && touched.name && 'border-red-500'} ${styles.input}`}
                        />
                    </div>
                    {errors.name && touched.name && (
                        <span className="block pt-2 font-semibold text-red-500">
                            {errors.name}
                        </span>
                    )}
                    {/* email field */}
                    <div className="mt-5">
                        <label htmlFor="email" className={`${styles.label}`}>
                            Enter your email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            id="email"
                            placeholder="Enter your email"
                            className={`${errors.email && touched.email && 'border-red-500'} ${styles.input}`}
                        />
                    </div>
                    {errors.email && touched.email && (
                        <span className="block pt-2 font-semibold text-red-500">
                            {errors.email}
                        </span>
                    )}
                    {/* password field */}
                    <div className="relative mb-1 mt-5 w-full">
                        <label htmlFor="password" className={`${styles.label}`}>
                            Enter your password
                        </label>
                        <input
                            type={`${!show ? 'password' : 'text'}`}
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            id="password"
                            placeholder="Enter your password"
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
                        <span className="block pt-2 font-semibold text-red-500">
                            {errors.password}
                        </span>
                    )}
                    {/* button submit */}
                    <div className="mt-5 w-full">
                        <input
                            type="submit"
                            value="Sign Up"
                            className={`${styles.button}`}
                        />
                    </div>
                    <br />
                    <h5 className="pt-4 text-center font-Poppins text-[14px] text-black dark:text-white">
                        Or Join with
                    </h5>
                    <div className="flex items-center justify-center">
                        <FcGoogle
                            size={30}
                            className="mr-2 cursor-pointer text-black dark:text-white"
                        />
                        <AiFillGithub
                            size={30}
                            className="ml-2 cursor-pointer text-black dark:text-white"
                        />
                    </div>
                    <h5 className="cursor-pointer pt-4 text-center font-Poppins text-black dark:text-white">
                        Already have any account?{' '}
                        <span
                            className="cursor-pointer pl-1 text-[#2190ff]"
                            onClick={() => setRoute('Login')}
                        >
                            Sign In
                        </span>
                    </h5>
                </form>
            </div>
        </>
    );
};

export default SignUp;
