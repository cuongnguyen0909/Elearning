'use client'
import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { styles } from '../../styles/style'

type Props = {
    setRoute: (route: string) => void
}

const signUpSchema = Yup.object().shape({
    name: Yup.string().required("Please enter your name"),
    email: Yup.string().email('Invalid email').required("Please enter your email"),
    password: Yup.string().required("Please enter your password").min(6, "Password must be at least 6 characters")
})

const SignUp: React.FC<Props> = (props) => {
    const { setRoute } = props
    const [show, setShow] = useState(false)
    const formik = useFormik({
        initialValues: { name: '', email: '', password: '' },
        validationSchema: signUpSchema,
        onSubmit: async ({ email, password }) => {
            setRoute('Verification')
        }
    })

    const { errors, touched, values, handleChange, handleSubmit } = formik

    return (
        <div className='w-full'>
            <h1 className={`${styles.title}`}>
                Join to ELearning
            </h1>
            <form onSubmit={handleSubmit}>
                {/* name field */}
                <div>
                    <label htmlFor="name" className={`${styles.label}`}>
                        Enter your name
                    </label>
                    <input type="name"
                        name=''
                        value={values.name}
                        onChange={handleChange}
                        id='name'
                        placeholder='Enter your name'
                        className={`${errors.name && touched.name && 'border-red-500'} ${styles.input}`}
                    />
                </div>
                {errors.name && touched.name &&
                    (<span className='text-red-500 font-semibold pt-2 block'>{errors.name}</span>)
                }
                {/* email field */}
                <div className='mt-5'>
                    <label htmlFor="email" className={`${styles.label}`}>
                        Enter your email
                    </label>
                    <input type="email"
                        name=''
                        value={values.email}
                        onChange={handleChange}
                        id='email'
                        placeholder='Enter your email'
                        className={`${errors.email && touched.email && 'border-red-500'} ${styles.input}`}
                    />
                </div>
                {errors.email && touched.email &&
                    (<span className='text-red-500 pt-2 font-semibold block'>{errors.email}</span>)
                }
                {/* password field */}
                <div className='w-full mt-5 relative mb-1'>
                    <label htmlFor="password" className={`${styles.label}`}>
                        Enter your password
                    </label>
                    <input
                        type={`${!show ? 'password' : 'text'}`}
                        name='password'
                        value={values.password}
                        onChange={handleChange}
                        id='password'
                        placeholder='Enter your password'
                        className={`${errors.password && touched.password && 'border-red-500'} ${styles.input}`}
                    />
                    {
                        !show ? (
                            <AiOutlineEyeInvisible
                                className='absolute bottom-3 right-2 z-1 cursor-pointer text-black dark:text-white'
                                size={20}
                                onClick={() => setShow(!show)}
                            />
                        ) : (

                            <AiOutlineEye
                                className='absolute bottom-3 right-2 z-1 cursor-pointer text-black dark:text-white'
                                size={20}
                                onClick={() => setShow(!show)}
                            />
                        )
                    }
                </div>
                {errors.password && touched.password &&
                    (<span className='text-red-500 pt-2 font-semibold block'>{errors.password}</span>)
                }
                {/* button submit */}
                <div className='w-full mt-5'>
                    <input type="submit" value='Sign Up' className={`${styles.button}`} />
                </div>
                <br />
                <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>
                    Or Join with
                </h5>
                <div className='flex items-center justify-center'>
                    <FcGoogle size={30} className='cursor-pointer mr-2 text-black dark:text-white' />
                    <AiFillGithub size={30} className='cursor-pointer ml-2 text-black dark:text-white' />
                </div>
                <h5 className='text-center pt-4 font-Poppins cursor-pointer dark:text-white text-black'>
                    Already have any account? {" "}
                    <span
                        className='text-[#2190ff] pl-1 cursor-pointer'
                        onClick={() => setRoute('Login')}
                    >
                        Sign In
                    </span>
                </h5>
            </form>

        </div>
    )
}

export default SignUp