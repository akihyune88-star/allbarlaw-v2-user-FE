import React, { useEffect, useRef, useState } from 'react'
import { FieldValues, Path, UseFormRegister, FieldErrors } from 'react-hook-form'
import styles from './emailEditSection.module.scss'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useEmailCheck } from '@/hooks/mutatate/useEmailCheck'
import LabelInput from '@/components/labelInput/LabelInput'

export type EmailEditSectionProps<T extends FieldValues> = {
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  onEmailError?: (_isError: boolean) => void
  currentEmail?: string
}

function EmailEditSection<T extends { email: string } & FieldValues>({
  register,
  errors,
  onEmailError,
  currentEmail,
}: EmailEditSectionProps<T>) {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const [emailMessage, setEmailMessage] = useState<string | undefined>(undefined)
  const [isEmailError, setIsEmailError] = useState(false)

  const { mutate: checkEmail } = useEmailCheck({
    onSuccess: data => {
      if (data.isAvailable) {
        setEmailMessage('사용 가능한 이메일입니다.')
        setIsEmailError(false)
        onEmailError?.(false)
      } else {
        setEmailMessage('이미 등록된 이메일입니다.')
        setIsEmailError(true)
        onEmailError?.(true)
      }
    },
    onError: message => {
      setEmailMessage(message)
      setIsEmailError(true)
      onEmailError?.(true)
    },
  })

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // 한글 제거 (영문, 숫자, 이메일 특수문자만 허용)
    const filteredValue = value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '')

    if (value !== filteredValue) {
      e.target.value = filteredValue
      value = filteredValue
    }

    setEmailMessage(undefined)
    setIsEmailError(false)
    onEmailError?.(false)

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      // 현재 이메일과 같으면 중복 체크 안 함
      if (value && value.includes('@') && value !== currentEmail) {
        checkEmail({ userEmail: value })
      } else if (value === currentEmail) {
        setEmailMessage('현재 사용 중인 이메일입니다.')
        setIsEmailError(false)
        onEmailError?.(false)
      }
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>이메일 주소 변경</h2>
      {!isMobile && <Divider padding={1} />}
      <LabelInput
        label='이메일'
        type='email'
        placeholder='이메일을 입력해주세요'
        {...register('email' as Path<T>, {
          onChange: handleEmailChange,
        })}
        isError={!!errors.email || isEmailError}
        message={(errors.email as any)?.message || emailMessage}
      />
    </section>
  )
}

export default EmailEditSection
