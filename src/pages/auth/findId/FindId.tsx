import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './findId.module.scss'
import { useSendVerificationCode } from '@/hooks/mutatate/useSendVerificationCode'
import { useUserFindId } from '@/hooks/queries/useAuth'
import useVerificationTimer from '@/hooks/useVerificationTimer'
import { ROUTER } from '@/routes/routerConstant'
import PhoneInput from '@/components/phoneInput/PhoneInput'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import SignUpTitle from '@/container/auth/signUpTitle/SignUpTitle'

const FindId = () => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const [step, setStep] = useState<'input' | 'result'>('input')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [apiMessage, setApiMessage] = useState<{ text: string; isError: boolean } | null>(null)
  const [codeError, setCodeError] = useState<{ text: string; isError: boolean } | null>(null)
  const [foundAccount, setFoundAccount] = useState('')

  const { isTimerRunning, formattedTime, startTimer, stopTimer } = useVerificationTimer(180)

  const { mutate: sendVerificationCode, isPending: _isSending } = useSendVerificationCode({
    onSuccess: () => {
      startTimer()
      setIsCodeSent(true)
      setApiMessage(null)
    },
    onError: message => {
      setCodeError({ text: message, isError: true })
    },
  })

  const { mutate: findId, isPending: isFinding } = useUserFindId({
    onSuccess: data => {
      setFoundAccount(data.userAccount || '')
      setIsVerified(true)
      stopTimer()
      setApiMessage({ text: '인증이 완료되었습니다. 아이디 찾기 버튼을 눌러주세요.', isError: false })
    },
    onError: () => {
      setApiMessage({ text: '등록된 계정을 찾을 수 없습니다.', isError: true })
    },
  })

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
    if (!verificationCode) {
      setApiMessage({ text: '인증번호를 입력해주세요.', isError: true })
      return
    }
    // 인증 버튼 클릭 시 바로 아이디 찾기 API 호출 (인증번호 검증 스킵)
    findId({
      phone: phoneNumber,
      certNumber: verificationCode,
    })
  }

  const handleFindId = () => {
    if (!isVerified || !foundAccount) {
      setApiMessage({ text: '인증을 먼저 완료해주세요.', isError: true })
      return
    }
    // 이미 받은 아이디로 결과 화면 표시
    setStep('result')
  }

  const handleLogin = () => {
    navigate(ROUTER.AUTH)
  }

  if (step === 'result') {
    return (
      <main className={`${styles['find-id-main']} center-layout`}>
        <SignUpTitle title='아이디 찾기' />
        <div className={styles['find-id-section']}>
          <h2 className={styles.title}>아이디 찾기 결과</h2>
          {!isMobile && <Divider padding={1} />}
          <div className={styles['result-content']}>
            <p className={styles['result-text']}>
              휴대폰 인증이 완료되었습니다.
              <br />
              아이디는 <strong>{foundAccount}</strong>입니다.
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
    !isCodeSent || isVerified || (isCodeSent && !isTimerRunning && !isVerified) || isFinding

  return (
    <main className={`${styles['find-id-main']} center-layout`}>
      <SignUpTitle title='아이디 찾기' />
      <div className={styles['find-id-section']}>
        <h2 className={styles.title}>휴대폰 인증</h2>
        {!isMobile && <Divider padding={1} />}
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
              {isFinding ? '확인중...' : '인증'}
            </button>
          }
          message={apiMessage?.text}
        />
        <button className={styles['submit-button']} onClick={handleFindId} disabled={!isVerified}>
          아이디 찾기
        </button>
      </div>
    </main>
  )
}

export default FindId
