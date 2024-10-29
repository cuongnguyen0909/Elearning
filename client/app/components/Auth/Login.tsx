'use client';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    AiOutlineEye,
    AiOutlineEyeInvisible,
    AiFillGithub
} from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { styles } from '../../utils/style';

type Props = {
    setRoute: (route: string) => void;
};

const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Please enter your email'),
    password: Yup.string()
        .required('Please enter your password')
        .min(6, 'Password must be at least 6 characters')
});

const Login: React.FC<Props> = (props) => {
    const { setRoute } = props;
    const [show, setShow] = useState(false);
    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: loginSchema,
        onSubmit: async ({ email, password }) => {
            console.log(email, password);
        }
    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className="w-full">
            <h1 className={`${styles.title}`}>Login to ELearning</h1>
            <form onSubmit={handleSubmit}>
                {/* email field */}
                <div>
                    <label htmlFor="email" className={`${styles.label}`}>
                        Enter your email
                    </label>
                    <input
                        type="email"
                        name=""
                        value={values.email}
                        onChange={handleChange}
                        id="email"
                        placeholder="Enter your email"
                        className={`${errors.email && touched.email && 'border-red-500'} ${styles.input}`}
                    />
                </div>
                {errors.email && touched.email && (
                    <span className="block pt-2 text-red-500">
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
                    <span className="block pt-2 text-red-500">
                        {errors.password}
                    </span>
                )}
                <div className="mt-5 w-full">
                    <input
                        type="submit"
                        value="Login"
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
                    Not have any account?{' '}
                    <span
                        className="cursor-pointer pl-1 text-[#2190ff]"
                        onClick={() => setRoute('Signup')}
                    >
                        Sign Up
                    </span>
                </h5>
            </form>
        </div>
    );
};

export default Login;
