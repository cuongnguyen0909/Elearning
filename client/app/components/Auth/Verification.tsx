import React, { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { VscWorkspaceTrusted } from 'react-icons/vsc'
import { styles } from '../../styles/style'

type Props = {
    setRoute: (route: string) => void
}

type VerifyNumber = {
    "0": string,
    "1": string,
    "2": string,
    "3": string,
}

const Verification: React.FC<Props> = (props) => {
    const { setRoute } = props
    const [invalidError, setInvalidError] = useState(false)
    const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
        0: '',
        1: '',
        2: '',
        3: ''
    })
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ]

    const verificationHandler = async () => {
        setInvalidError(true)
    }
    const handleInputChange = (index: number, value: string) => {
        setInvalidError(false)
        const newVerifyNumber = { ...verifyNumber, [index]: value }
        setVerifyNumber(newVerifyNumber)

        if (value === '' && index > 0) {
            inputRefs[index - 1].current?.focus()
        } else if (value.length === 1 && index < 3) {
            inputRefs[index + 1].current?.focus()
        }
    }
    return (
        <div>
            <h1 className={`${styles.title}`}>
                Verification Code
            </h1>
            <br />
            <div className='w-full flex items-center justify-center mt-2'>
                <div className='w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center'>
                    <VscWorkspaceTrusted className='text-5xl text-white' size={40} />
                </div>

            </div>
            <br />
            <br />
            <div className=' m-auto flex items-center justify-around'>
                {
                    Object.keys(verifyNumber).map((key, index) => (
                        <input
                            type='number'
                            key={key}
                            ref={inputRefs[index]}
                            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center
                                text-black dark:text-white justify-center text-[18px] font-Poppins outline-none text-center 
                                ${invalidError
                                    ? 'shake border-red-500'
                                    : 'dark:border-white border-[#0000004a]'
                                }`}
                            placeholder=''
                            maxLength={1}
                            onInput={(e) => {
                                e.currentTarget.value = e.currentTarget.value.slice(0, 1)
                            }}
                            min={0}
                            value={verifyNumber[key as keyof VerifyNumber]}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                        />
                    ))
                }
            </div>
            <br />
            <br />
            <div className='w-full flex justify-center'>
                <button
                    className={`${styles.button}`}
                    onClick={verificationHandler}
                >
                    Verify OTP
                </button>
            </div>
            <br />
            <h5 className='text-center pt-4 font-Poppins cursor-pointer dark:text-white text-black'>
                Go back to Sign in?
                <span
                    className='text-[#2190ff] pl-1 cursor-pointer'
                    onClick={() => setRoute('Login')}
                >
                    Sign In
                </span>
            </h5>
        </div>
    )
}

export default Verification