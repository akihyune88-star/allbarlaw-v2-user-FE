import React, { useEffect, useRef, useState } from 'react'
import { FieldValues, Path, UseFormRegister, FieldErrors } from 'react-hook-form'
import styles from './emailInputSection.module.scss'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useEmailCheck } from '@/hooks/mutatate/useEmailCheck'
import LabelInput from '@/components/labelInput/LabelInput'

export type EmailInputSectionProps<T extends FieldValues> = {
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  onEmailError?: (isError: boolean) => void
}

function EmailInputSection<T extends { email: string } & FieldValues>({
  register,
  errors,
  onEmailError,
}: EmailInputSectionProps<T>) {
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
    const value = e.target.value
    setEmailMessage(undefined)
    setIsEmailError(false)
    onEmailError?.(false)
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    debounceTimer.current = setTimeout(() => {
      if (value && value.includes('@')) {
        checkEmail({ userEmail: value })
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
      <h2 className={styles.title}>이메일 주소 - 계정 분실시 필요</h2>
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

export default EmailInputSection
