import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './lawyerFindId.module.scss'
import { useLawyerFindId } from '@/hooks/queries/useAuth'
import { ROUTER } from '@/routes/routerConstant'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import SignUpTitle from '@/container/auth/signUpTitle/SignUpTitle'
import LabelInput from '@/components/labelInput/LabelInput'

const LawyerFindId = () => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const [step, setStep] = useState<'input' | 'result'>('input')
  const [email, setEmail] = useState('')
  const [lawyerName, setLawyerName] = useState('')
  const [lawyerLicenseNumber, setLawyerLicenseNumber] = useState('')
  const [foundAccount, setFoundAccount] = useState('')
  const [apiMessage, setApiMessage] = useState<{ text: string; isError: boolean } | null>(null)

  const { mutate: findLawyerId, isPending: isFinding } = useLawyerFindId({
    onSuccess: data => {
      setFoundAccount(data.lawyerAccount || '')
      setStep('result')
    },
    onError: () => {
      setApiMessage({ text: '등록된 계정을 찾을 수 없습니다.', isError: true })
    },
  })

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

  const handleFindId = () => {
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

    // 아이디 찾기 API 호출
    findLawyerId({
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
      <main className={`${styles['lawyer-find-id-main']} center-layout`}>
        <SignUpTitle title='변호사 아이디 찾기' />
        <div className={styles['lawyer-find-id-section']}>
          <h2 className={styles.title}>아이디 찾기 결과</h2>
          {!isMobile && <Divider padding={1} />}
          <div className={styles['result-content']}>
            <p className={styles['result-text']}>
              인증이 완료되었습니다.
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

  return (
    <main className={`${styles['lawyer-find-id-main']} center-layout`}>
      <SignUpTitle title='변호사 아이디 찾기' />
      <div className={styles['lawyer-find-id-section']}>
        <h2 className={styles.title}>본인 인증</h2>
        {!isMobile && <Divider padding={1} />}

        <LabelInput
          label='이메일 주소'
          type='email'
          placeholder='메일주소를 모두 입력해주세요'
          value={email}
          onChange={handleEmailChange}
          isError={false}
        />

        <LabelInput
          label='변호사 이름'
          placeholder='한글 2자이상 입력해주세요.'
          value={lawyerName}
          onChange={handleNameChange}
          isError={false}
        />

        <LabelInput
          label='변호사 연락처'
          placeholder='연락처를 입력하세요.'
          value={lawyerLicenseNumber}
          onChange={handleLicenseNumberChange}
          isError={false}
        />

        {apiMessage && (
          <div className={apiMessage.isError ? styles['error-message'] : styles['success-message']}>
            {apiMessage.text}
          </div>
        )}

        <button className={styles['submit-button']} onClick={handleFindId} disabled={isFinding}>
          {isFinding ? '조회중...' : '아이디 찾기'}
        </button>
      </div>
    </main>
  )
}

export default LawyerFindId
