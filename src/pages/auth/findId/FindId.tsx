import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './findId.module.scss'
import { useSendVerificationCode } from '@/hooks/mutatate/useSendVerificationCode'
import { useVerifyVerificationCode } from '@/hooks/mutatate/useVerifyVerificationCode'
import { useUserFindId } from '@/hooks/queries/useAuth'
import useVerificationTimer from '@/hooks/useVerificationTimer'
import { LOCAL } from '@/constants/local'
import { ROUTER } from '@/routes/routerConstant'

const FindId = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<'input' | 'result'>('input')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [codeError, setCodeError] = useState('')
  const [foundAccount, setFoundAccount] = useState('')

  const { isTimerRunning, formattedTime, startTimer, stopTimer } = useVerificationTimer(180)

  const { mutate: sendVerificationCode, isPending: isSending } = useSendVerificationCode({
    onSuccess: () => {
      startTimer()
      setIsCodeSent(true)
      setPhoneError('')
    },
    onError: message => {
      setPhoneError(message)
    },
  })

  const { mutate: verifyVerificationCode, isPending: isVerifying } = useVerifyVerificationCode({
    onSuccess: () => {
      setIsVerified(true)
      stopTimer()
      setCodeError('')
      // 인증 성공 후 아이디 찾기 API 호출
      findUserId()
    },
    onError: message => {
      setCodeError(message)
    },
  })

  const { mutate: findId } = useUserFindId({
    onSuccess: data => {
      // 응답에서 아이디 추출 (API 응답 구조에 따라 조정 필요)
      setFoundAccount(data.userAccount || '')
      setStep('result')
    },
    onError: () => {
      setCodeError('등록된 계정을 찾을 수 없습니다.')
    },
  })

  const findUserId = () => {
    const verificationToken = sessionStorage.getItem(LOCAL.VERIFICATION_TOKEN)
    if (verificationToken) {
      findId({
        phone: phoneNumber,
        certNumber: verificationCode,
      })
    }
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
      setPhoneError('휴대폰 번호를 입력해주세요.')
      return
    }
    if (phoneNumber.length < 10 || phoneNumber.length > 11) {
      setPhoneError('올바른 휴대폰 번호를 입력해주세요.')
      return
    }
    sendVerificationCode(phoneNumber)
  }

  const handleVerifyCode = () => {
    if (!verificationCode) {
      setCodeError('인증번호를 입력해주세요.')
      return
    }
    verifyVerificationCode({
      phone: phoneNumber,
      certNumber: verificationCode,
    })
  }

  const handleFindId = () => {
    if (!isVerified) {
      setCodeError('휴대폰 인증을 완료해주세요.')
      return
    }
    findUserId()
  }

  const handleLogin = () => {
    navigate(ROUTER.AUTH)
  }

  if (step === 'result') {
    return (
      <div className={styles['find-id-container']}>
        <header className={styles['find-id-header']}>
          <h1>아이디 찾기</h1>
        </header>
        <section className={styles['find-id-result']}>
          <h2>아이디 찾기 결과</h2>
          <div className={styles['result-box']}>
            <p>
              휴대폰 인증이 완료되었습니다.
              <br />
              아이디는 <span className={styles['highlight']}>{foundAccount}</span> 입니다.
            </p>
          </div>
          <button className={styles['login-button']} onClick={handleLogin}>
            로그인
          </button>
        </section>
      </div>
    )
  }

  return (
    <div className={styles['find-id-container']}>
      <header className={styles['find-id-header']}>
        <h1>아이디 찾기</h1>
      </header>
      <section className={styles['find-id-form']}>
        <h2>휴대폰 인증</h2>

        <div className={styles['input-group']}>
          <label>휴대폰 번호</label>
          <div className={styles['input-with-button']}>
            <input
              type='text'
              placeholder='전화번호를 입력해주세요'
              value={phoneNumber}
              onChange={handlePhoneChange}
              maxLength={11}
              disabled={isVerified}
            />
            <button onClick={handleSendCode} disabled={isSending || isVerified} className={styles['send-button']}>
              {isSending ? '전송중...' : '인증번호 발송'}
            </button>
          </div>
          {phoneError && <p className={styles['error-message']}>{phoneError}</p>}
          {isCodeSent && !isVerified && (
            <p className={styles['success-message']}>인증번호가 문자로 발송되었습니다. 인증번호를 입력해주세요.</p>
          )}
        </div>

        <div className={styles['input-group']}>
          <label>인증번호 입력</label>
          <div className={styles['input-with-button']}>
            <input
              type='text'
              placeholder='인증번호를 입력해 주세요'
              value={verificationCode}
              onChange={handleCodeChange}
              maxLength={6}
              disabled={!isCodeSent || isVerified}
            />
            <button
              onClick={handleVerifyCode}
              disabled={!isCodeSent || isVerifying || isVerified}
              className={styles['verify-button']}
            >
              {isVerifying ? '확인중...' : '인증'}
            </button>
          </div>
          {isTimerRunning && <p className={styles['timer']}>남은 시간: {formattedTime}</p>}
          {codeError && <p className={styles['error-message']}>{codeError}</p>}
          {isVerified && <p className={styles['success-message']}>인증이 완료되었습니다.</p>}
        </div>

        <button className={styles['submit-button']} onClick={handleFindId} disabled={!isVerified}>
          아이디 찾기
        </button>
      </section>
    </div>
  )
}

export default FindId
