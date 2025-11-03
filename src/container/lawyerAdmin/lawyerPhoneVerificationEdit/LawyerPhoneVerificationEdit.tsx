import { useFormContext } from 'react-hook-form'
import { useState } from 'react'
import type { AccountEditFormData } from '@/container/mypage/accountEdit/accountEditSchema'
import styles from './lawyerPhoneVerificationEdit.module.scss'
import Divider from '@/components/divider/Divider'
import PhoneInput from '@/components/phoneInput/PhoneInput'
import { useSendVerificationCode } from '@/hooks/mutatate/useSendVerificationCode'
import useVerificationTimer from '@/hooks/useVerificationTimer'
import { useVerifyVerificationCode } from '@/hooks/mutatate/useVerifyVerificationCode'

export type LawyerPhoneVerificationEditProps = {
  currentPhone?: string
}

const formatPhoneNumber = (phone?: string) => {
  if (!phone) return '-'
  const numbers = phone.replace(/[^0-9]/g, '')
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }
  return phone
}

function LawyerPhoneVerificationEdit({ currentPhone }: LawyerPhoneVerificationEditProps) {
  const {
    register,
    getValues,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useFormContext<AccountEditFormData>()

  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [apiMessage, setApiMessage] = useState<{ text: string; isError: boolean } | null>(null)
  const [codeError, setCodeError] = useState<{ text: string; isError: boolean } | null>(null)

  const phoneNumberValue = watch('lawyerPhone')
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
    onSuccess: () => {
      setIsVerified(true)
      stopTimer()
      setApiMessage({ text: '인증이 완료되었습니다.', isError: false })
    },
    onError: message => {
      setApiMessage({ text: message, isError: true })
    },
  })

  const handleSendVerificationCode = async () => {
    const isValid = await trigger('lawyerPhone')
    if (isValid) {
      const phone = getValues('lawyerPhone')
      if (!phone) return

      // 현재 등록된 번호와 동일한지 체크
      if (currentPhone && phone === currentPhone) {
        setCodeError({ text: '현재 등록된 번호입니다. 다른 번호를 입력해주세요.', isError: true })
        return
      }

      setValue('lawyerVerificationCode', '')
      setCodeError(null)
      sendVerificationCode({ phone, purpose: 'profile_update' })
    }
  }

  const handleVerifyCode = async () => {
    const isFormValid = await trigger('lawyerVerificationCode')
    if (!isFormValid) return

    const code = getValues('lawyerVerificationCode')
    const phone = phoneNumberValue
    if (!phone || !code) return

    await verifyVerificationCode({
      phone,
      certNumber: code,
    })
  }

  const isButtonDisabled = isTimerRunning || !phoneNumberValue || !!(errors as any).lawyerPhone || isVerified
  const isVerificationDisabled = !isCodeSent || isVerified || (isCodeSent && !isTimerRunning && !isVerified)

  return (
    <section className={styles['phone-verification-section']}>
      <h2 className={styles['phone-verification-title']}>휴대폰 인증</h2>
      <Divider padding={1} />
      <div className={styles['phone-verification-fields']}>
        <div className={styles['phone-display-container']}>
          <div className={styles['field-container']}>
            <label className={styles['label']}>인증 휴대폰번호</label>
            <div className={styles['text-value']}>{formatPhoneNumber(currentPhone)}</div>
          </div>
          <span className={styles['field-message']}>휴대폰 번호를 변경하시려면 아래 휴대폰 인증을 다시해주세요</span>
        </div>
        <PhoneInput
          label='새 휴대폰 번호'
          placeholder="변경할 휴대폰 번호를 '-' 없이 숫자만 입력"
          maxLength={11}
          {...register('lawyerPhone')}
          isError={!!(errors as any).lawyerPhone || codeError?.isError}
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
            isCodeSent && !(errors as any).lawyerPhone
              ? '인증번호가 문자로 발송되었습니다. 인증번호를 입력해주세요.'
              : (errors as any).lawyerPhone?.message || codeError?.text
          }
        />
        <PhoneInput
          label='인증번호'
          placeholder='인증번호 6자리 입력'
          maxLength={6}
          {...register('lawyerVerificationCode')}
          isError={apiMessage?.isError ?? !!(errors as any).lawyerVerificationCode}
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
          message={apiMessage?.text || (errors as any).lawyerVerificationCode?.message}
        />
      </div>
    </section>
  )
}

export default LawyerPhoneVerificationEdit
