import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { FC, useEffect, useState } from 'react';
import { useCreateEnrollmentMutation } from '../../../redux/features/enrollment/enrollmentApi';
import { useLoadUserQuery } from '../../../redux/features/api/apiSlice';
import { styles } from '../../utils/style';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';

interface CheckoutFormProps {
  setOpen: any;
  data: any;
}

const CheckoutForm: FC<CheckoutFormProps> = (props) => {
  const { setOpen, data } = props;
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<any>('');
  const [loadUser, setLoadUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [
    createEnrollment,
    {
      data: dataCreateEnrollment,
      error: errorCreateEnrollment,
      isLoading: isLoadingCreateEnrollment,
      isSuccess: isSuccessCreateEnrollment
    }
  ] = useCreateEnrollmentMutation();
  const {} = useLoadUserQuery(
    {},
    {
      skip: !loadUser ? true : false
    }
  );

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const { error, paymentIntent } = await stripe?.confirmPayment({
      elements,
      redirect: 'if_required'
    });
    if (error) {
      setMessage(error?.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // success
      setMessage('Payment succeeded!');
      const enrollmentData = {
        course: data?._id,
        payment_info: paymentIntent
      };
      await createEnrollment(enrollmentData);
      setIsLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (errorCreateEnrollment) {
      setLoadUser(true);
    }
    if (isSuccessCreateEnrollment) {
      toast.success('Payment success');
      window.location.reload();
    }
    if (errorCreateEnrollment) {
      if ('data' in errorCreateEnrollment) {
        const errorData = errorCreateEnrollment as any;
        setMessage(errorData.data.message);
      }
    }
  }, [errorCreateEnrollment, errorCreateEnrollment]);
  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text" className={`${styles.button} mt-2 !h-[35px]`}>
          {isLoading ? 'Paying...' : 'Pay now'}
        </span>
      </button>
      {/* show any error or success message */}
      {message && (
        <div id="payment-message" className="pt-2 font-Poppins text-[red]">
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
