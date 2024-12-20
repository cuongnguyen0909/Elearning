import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { styles } from '../../utils/style';
import { useSelector } from 'react-redux';
import { useActivateMutation } from '../../../redux/features/auth/authApi';
import Loading from '../../../components/common/Loading';

type Props = {
  setRoute: (route: string) => void;
};

type VerifyNumber = {
  '0': string;
  '1': string;
  '2': string;
  '3': string;
};

const Verification: React.FC<Props> = (props) => {
  const { setRoute } = props;
  const { token } = useSelector((state: any) => state.auth);
  const [activate, { data, isSuccess, error, isLoading }] = useActivateMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = 'Xác thực thành công';
      toast.success(message, {
        duration: 2000
      });
      setRoute('Login');
    }
    if (error) {
      const errorData = error as any;
      toast.error('Xác thực thất bại', {
        duration: 2000
      });
    }
  }, [isSuccess, error]);
  const [invalidError, setInvalidError] = useState(false);
  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: '',
    1: '',
    2: '',
    3: ''
  });
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join('');
    if (verificationNumber.length < 4) {
      setInvalidError(true);
      return;
    }
    const dataActivation: any = {
      activationCode: verificationNumber,
      activationToken: token
    };
    await activate(dataActivation);
  };
  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };
  return (
    <div>
      <div className="w-full">{isLoading && <Loading />}</div>
      <h1 className={`${styles.title}`}>Nhập mã xác thực</h1>
      <br />
      <div className="mt-2 flex w-full items-center justify-center">
        <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#497DF2]">
          <VscWorkspaceTrusted className="text-5xl text-white" size={40} />
        </div>
      </div>
      <br />
      <br />
      <div className="m-auto flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            className={`font-Arimo flex h-[65px] w-[65px] items-center justify-center rounded-[10px] border-[3px] bg-transparent text-center text-[18px] text-black outline-none dark:text-white ${
              invalidError ? 'shake border-red-500' : 'border-[#0000004a] dark:border-white'
            }`}
            placeholder=""
            maxLength={1}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.slice(0, 1);
            }}
            min={0}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <br />
      <br />
      <div className="flex w-full justify-center">
        <button className={`${styles.button}`} onClick={verificationHandler}>
          Xác thực
        </button>
      </div>
      <br />
      <h5 className="font-Arimo cursor-pointer pt-4 text-center text-black dark:text-white">
        Bạn đã có tài khoản?
        <span className="cursor-pointer pl-1 text-[#2190ff]" onClick={() => setRoute('Login')}>
          Đăng nhập ngay
        </span>
      </h5>
    </div>
  );
};

export default Verification;
