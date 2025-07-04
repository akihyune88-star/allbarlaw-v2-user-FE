import { useFormContext } from 'react-hook-form'
import type { SignUpFormData } from '@/pages/auth/signUp/signUpForm/signUpSchema'
import styles from './phoneVerificationSection.module.scss'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import PhoneInput from '@/components/phoneInput/PhoneInput'
import { useSendVerificationCode } from '@/hooks/mutatate/useSendVerificationCode'
import useVerificationTimer from '@/hooks/useVerificationTimer'

const PhoneVerificationSection = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const {
    register,
    getValues,
    formState: { errors },
    trigger,
    watch,
  } = useFormContext<SignUpFormData>()

  const phoneNumberValue = watch('phoneNumber')
  const { isTimerRunning, formattedTime, startTimer } = useVerificationTimer(180)
  const { mutate: sendVerificationCode } = useSendVerificationCode({
    onSuccess: () => {
      startTimer()
    },
  })

  const handleSendVerificationCode = async () => {
    const isValid = await trigger('phoneNumber')
    if (isValid) {
      sendVerificationCode(getValues('phoneNumber'))
    }
  }

  const isButtonDisabled = isTimerRunning || !phoneNumberValue || !!errors.phoneNumber

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>휴대폰 인증</h2>
      {!isMobile && <Divider padding={1} />}
      <PhoneInput
        label='휴대폰 번호'
        placeholder="'-' 없이 숫자만 입력"
        maxLength={11}
        {...register('phoneNumber')}
        isError={!!errors.phoneNumber}
        disabled={isTimerRunning}
        rightContent={
          isTimerRunning ? (
            <div className={styles.timer}>{formattedTime}</div>
          ) : (
            <button
              type='button'
              className={styles['phone-input-button']}
              onClick={handleSendVerificationCode}
              disabled={isButtonDisabled}
            >
              인증번호 발송
            </button>
          )
        }
        message={errors.phoneNumber?.message}
      />
      <PhoneInput
        label='인증번호'
        placeholder='인증번호 6자리 입력'
        maxLength={6}
        {...register('verificationCode')}
        isError={!!errors.verificationCode}
        rightContent={<button className={styles['phone-input-button']}>인증</button>}
        message={errors.verificationCode?.message}
      />
    </section>
  )
}

export default PhoneVerificationSection
