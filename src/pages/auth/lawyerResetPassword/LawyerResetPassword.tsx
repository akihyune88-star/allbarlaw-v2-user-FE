import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './lawyerResetPassword.module.scss'
import { useLawyerResetPassword } from '@/hooks/queries/useAuth'
import { ROUTER } from '@/routes/routerConstant'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import SignUpTitle from '@/container/auth/signUpTitle/SignUpTitle'
import LabelInput from '@/components/labelInput/LabelInput'

const LawyerResetPassword = () => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const [step, setStep] = useState<'input' | 'result'>('input')
  const [lawyerAccount, setLawyerAccount] = useState('')
  const [email, setEmail] = useState('')
  const [lawyerName, setLawyerName] = useState('')
  const [lawyerLicenseNumber, setLawyerLicenseNumber] = useState('')
  const [apiMessage, setApiMessage] = useState<{ text: string; isError: boolean } | null>(null)

  const { mutate: resetPassword, isPending: isResetting } = useLawyerResetPassword({
    onSuccess: _data => {
      setStep('result')
    },
    onError: () => {
      setApiMessage({ text: '비밀번호 재설정에 실패했습니다.', isError: true })
    },
  })

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLawyerAccount(e.target.value)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLawyerName(e.target.value)
  }

  const handleLicenseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setLawyerLicenseNumber(value)
  }

  const handleResetPassword = () => {
    if (!lawyerAccount) {
      setApiMessage({ text: '로그인 아이디를 입력해주세요.', isError: true })
      return
    }
    if (!email) {
      setApiMessage({ text: '이메일 주소를 입력해주세요.', isError: true })
      return
    }
    if (!lawyerName) {
      setApiMessage({ text: '변호사 이름을 입력해주세요.', isError: true })
      return
    }
    if (!lawyerLicenseNumber) {
      setApiMessage({ text: '변호사 연락처를 입력해주세요.', isError: true })
      return
    }

    // 비밀번호 재설정 API 호출
    resetPassword({
      lawyerAccount,
      lawyerEmail: email,
      lawyerName,
      lawyerContact: lawyerLicenseNumber,
    })
  }

  const handleLogin = () => {
    navigate(ROUTER.AUTH)
  }

  if (step === 'result') {
    return (
      <main className={`${styles['lawyer-reset-password-main']} center-layout`}>
        <SignUpTitle title='변호사 비밀번호 찾기' />
        <div className={styles['lawyer-reset-password-section']}>
          <h2 className={styles.title}>비밀번호 찾기 결과</h2>
          {!isMobile && <Divider padding={1} />}
          <div className={styles['result-content']}>
            <p className={styles['result-text']}>
              인증이 완료되었습니다.
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

  return (
    <main className={`${styles['lawyer-reset-password-main']} center-layout`}>
      <SignUpTitle title='변호사 비밀번호 찾기' />
      <div className={styles['lawyer-reset-password-section']}>
        <h2 className={styles.title}>본인 인증</h2>
        {!isMobile && <Divider padding={1} />}

        <LabelInput
          label='로그인 아이디'
          placeholder='영문,숫자 포함 5자 이상 가능합니다.'
          value={lawyerAccount}
          onChange={handleAccountChange}
          isError={false}
          message={lawyerAccount && '이메일 형식으로 적어주세요'}
        />

        <LabelInput
          label='이메일 주소'
          type='email'
          placeholder='메일주소를 모두 입력해주세요'
          value={email}
          onChange={handleEmailChange}
          isError={false}
          message={email && '이메일 형식으로 적어주세요'}
        />

        <LabelInput
          label='변호사 이름'
          placeholder='한글 2자이상 입력해주세요.'
          value={lawyerName}
          onChange={handleNameChange}
          isError={false}
          message={lawyerName && '한글 2자이상 입력해주세요.'}
        />

        <LabelInput
          label='변호사 연락처'
          placeholder='연락처를 입력하세요.'
          value={lawyerLicenseNumber}
          onChange={handleLicenseNumberChange}
          isError={false}
          message={lawyerLicenseNumber && '인증이 완료되었습니다.'}
        />

        {apiMessage && (
          <div className={apiMessage.isError ? styles['error-message'] : styles['success-message']}>
            {apiMessage.text}
          </div>
        )}

        <button className={styles['submit-button']} onClick={handleResetPassword} disabled={isResetting}>
          {isResetting ? '처리중...' : '아이디 찾기'}
        </button>
      </div>
    </main>
  )
}

export default LawyerResetPassword
