import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './resetPassword.module.scss'
import { useSendVerificationCode } from '@/hooks/mutatate/useSendVerificationCode'
import { useUserResetPassword } from '@/hooks/queries/useAuth'
import useVerificationTimer from '@/hooks/useVerificationTimer'
import { ROUTER } from '@/routes/routerConstant'
import PhoneInput from '@/components/phoneInput/PhoneInput'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import SignUpTitle from '@/container/auth/signUpTitle/SignUpTitle'
import LabelInput from '@/components/labelInput/LabelInput'

const ResetPassword = () => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const [step, setStep] = useState<'input' | 'result'>('input')
  const [userAccount, setUserAccount] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [apiMessage, setApiMessage] = useState<{ text: string; isError: boolean } | null>(null)
  const [codeError, setCodeError] = useState<{ text: string; isError: boolean } | null>(null)
  const [accountError, setAccountError] = useState('')

  const { isTimerRunning, formattedTime, startTimer, stopTimer } = useVerificationTimer(180)

  const { mutate: sendVerificationCode, isPending: isSending } = useSendVerificationCode({
    onSuccess: () => {
      startTimer()
      setIsCodeSent(true)
      setApiMessage(null)
    },
    onError: message => {
      setCodeError({ text: message, isError: true })
    },
  })

  const { mutate: resetPassword, isPending: isResetting } = useUserResetPassword({
    onSuccess: data => {
      setIsVerified(true)
      stopTimer()
      setApiMessage({ text: '인증이 완료되었습니다. 비밀번호 찾기 버튼을 눌러주세요.', isError: false })
    },
    onError: () => {
      setApiMessage({ text: '비밀번호 재설정에 실패했습니다.', isError: true })
    },
  })

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAccount(e.target.value)
    setAccountError('')
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setPhoneNumber(value)
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setVerificationCode(value)
  }

  const handleSendCode = () => {
    if (!phoneNumber) {
      setCodeError({ text: '휴대폰 번호를 입력해주세요.', isError: true })
      return
    }
    if (phoneNumber.length < 10 || phoneNumber.length > 11) {
      setCodeError({ text: '올바른 휴대폰 번호를 입력해주세요.', isError: true })
      return
    }
    setVerificationCode('')
    sendVerificationCode({ phone: phoneNumber, purpose: 'recovery' })
  }

  const handleVerifyCode = () => {
    if (!userAccount) {
      setAccountError('아이디를 입력해주세요.')
      return
    }
    if (!verificationCode) {
      setApiMessage({ text: '인증번호를 입력해주세요.', isError: true })
      return
    }
    // 인증 버튼 클릭 시 바로 비밀번호 재설정 API 호출
    resetPassword({
      account: userAccount,
      phone: phoneNumber,
      certNumber: verificationCode,
    })
  }

  const handleResetPassword = () => {
    if (!isVerified) {
      setApiMessage({ text: '인증을 먼저 완료해주세요.', isError: true })
      return
    }
    // 이미 비밀번호 재설정이 완료된 경우 결과 화면 표시
    setStep('result')
  }

  const handleLogin = () => {
    navigate(ROUTER.AUTH)
  }

  if (step === 'result') {
    return (
      <main className={`${styles['reset-password-main']} center-layout`}>
        <SignUpTitle title='비밀번호 찾기' />
        <div className={styles['reset-password-section']}>
          <h2 className={styles.title}>비밀번호 찾기 결과</h2>
          {!isMobile && <Divider padding={1} />}
          <div className={styles['result-content']}>
            <p className={styles['result-text']}>
              휴대폰 인증이 완료되었습니다.
              <br />
              등록된 이메일 주소로 <strong>초기화된 비밀번호</strong>를{isMobile && <br />}
              보내 드렸습니다.
              <br />
              확인후 로그인 하세요.
            </p>
          </div>
          <button className={styles['submit-button']} onClick={handleLogin}>
            로그인
          </button>
        </div>
      </main>
    )
  }

  const isButtonDisabled = isTimerRunning || !phoneNumber || isVerified
  const isVerificationDisabled =
    !isCodeSent || isVerified || (isCodeSent && !isTimerRunning && !isVerified) || isResetting

  return (
    <main className={`${styles['reset-password-main']} center-layout`}>
      <SignUpTitle title='비밀번호 찾기' />
      <div className={styles['reset-password-section']}>
        <h2 className={styles.title}>휴대폰 인증</h2>
        {!isMobile && <Divider padding={1} />}

        <LabelInput
          label='아이디'
          placeholder='아이디를 입력해주세요'
          value={userAccount}
          onChange={handleAccountChange}
          isError={!!accountError}
          message={accountError}
        />

        <PhoneInput
          label='휴대폰 번호'
          placeholder="'-' 없이 숫자만 입력"
          maxLength={11}
          value={phoneNumber}
          onChange={handlePhoneChange}
          isError={!!codeError?.isError}
          disabled={isTimerRunning || isVerified}
          rightContent={
            isTimerRunning ? (
              <div className={styles.timer}>{formattedTime}</div>
            ) : (
              <button
                type='button'
                className={styles['phone-input-button']}
                onClick={handleSendCode}
                disabled={isButtonDisabled}
              >
                인증번호 발송
              </button>
            )
          }
          message={
            isCodeSent && !codeError ? '인증번호가 문자로 발송되었습니다. 인증번호를 입력해주세요.' : codeError?.text
          }
        />
        <PhoneInput
          label='인증번호'
          placeholder='인증번호 6자리 입력'
          maxLength={6}
          value={verificationCode}
          onChange={handleCodeChange}
          isError={apiMessage?.isError}
          disabled={isVerificationDisabled}
          rightContent={
            <button
              type='button'
              className={styles['phone-input-button']}
              onClick={handleVerifyCode}
              disabled={isVerificationDisabled}
            >
              {isResetting ? '확인중...' : '인증'}
            </button>
          }
          message={apiMessage?.text}
        />
        <button className={styles['submit-button']} onClick={handleResetPassword} disabled={!isVerified}>
          비밀번호 찾기
        </button>
      </div>
    </main>
  )
}

export default ResetPassword
