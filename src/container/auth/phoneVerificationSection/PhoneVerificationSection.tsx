import { useFormContext } from 'react-hook-form'
import { useState } from 'react'
import { isAxiosError } from 'axios'
import type { SignUpFormData } from '@/pages/auth/signUp/signUpForm/signUpSchema'
import styles from './phoneVerificationSection.module.scss'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import PhoneInput from '@/components/phoneInput/PhoneInput'
import { useSendVerificationCode } from '@/hooks/mutatate/useSendVerificationCode'
import useVerificationTimer from '@/hooks/useVerificationTimer'
import { useVerifyVerificationCode } from '@/hooks/mutatate/useVerifyVerificationCode'

const PhoneVerificationSection = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const {
    register,
    getValues,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useFormContext<SignUpFormData>()

  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [apiMessage, setApiMessage] = useState<{ text: string; isError: boolean } | null>(null)
  const [codeError, setCodeError] = useState<{ text: string; isError: boolean } | null>(null)

  const phoneNumberValue = watch('phoneNumber')
  const { isTimerRunning, formattedTime, startTimer, stopTimer } = useVerificationTimer(180)
  const { mutate: sendVerificationCode } = useSendVerificationCode({
    onSuccess: () => {
      startTimer()
      setIsCodeSent(true)
      setApiMessage(null)
    },
    onError: message => {
      setCodeError({ text: message, isError: true })
    },
  })
  const { mutateAsync: verifyVerificationCode } = useVerifyVerificationCode({
    onError: message => {
      setApiMessage({ text: message, isError: true })
    },
  })

  const handleSendVerificationCode = async () => {
    const isValid = await trigger('phoneNumber')
    if (isValid) {
      setValue('verificationCode', '')
      sendVerificationCode(getValues('phoneNumber'))
    }
  }

  const handleVerifyCode = async () => {
    const isFormValid = await trigger('verificationCode')
    if (!isFormValid) return

    const code = getValues('verificationCode')

    try {
      const result = await verifyVerificationCode({
        phone: phoneNumberValue,
        certNumber: code,
      })
      if (result.data) {
        setIsVerified(true)
        stopTimer()
        setApiMessage({ text: '인증이 완료되었습니다.', isError: false })
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setApiMessage({ text: error.response.data.detail, isError: true })
      } else {
        setApiMessage({ text: '알 수 없는 오류가 발생했습니다.', isError: true })
      }
    }
  }

  const isButtonDisabled = isTimerRunning || !phoneNumberValue || !!errors.phoneNumber || isVerified
  const isVerificationDisabled = !isCodeSent || isVerified || (isCodeSent && !isTimerRunning && !isVerified)

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>휴대폰 인증</h2>
      {!isMobile && <Divider padding={1} />}
      <PhoneInput
        label='휴대폰 번호'
        placeholder="'-' 없이 숫자만 입력"
        maxLength={11}
        {...register('phoneNumber')}
        isError={!!errors.phoneNumber || codeError?.isError}
        disabled={isTimerRunning || isVerified}
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
        message={
          isCodeSent && !errors.phoneNumber
            ? '인증번호가 문자로 발송되었습니다. 인증번호를 입력해주세요.'
            : errors.phoneNumber?.message || codeError?.text
        }
      />
      <PhoneInput
        label='인증번호'
        placeholder='인증번호 6자리 입력'
        maxLength={6}
        {...register('verificationCode')}
        isError={apiMessage?.isError ?? !!errors.verificationCode}
        disabled={isVerificationDisabled}
        rightContent={
          <button
            type='button'
            className={styles['phone-input-button']}
            onClick={handleVerifyCode}
            disabled={isVerificationDisabled}
          >
            인증
          </button>
        }
        message={apiMessage?.text || errors.verificationCode?.message}
      />
    </section>
  )
}

export default PhoneVerificationSection
