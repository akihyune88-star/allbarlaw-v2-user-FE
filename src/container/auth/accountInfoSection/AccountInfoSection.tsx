import React, { useEffect, useRef, useState } from 'react'
import type { UseFormRegister, FieldErrors, UseFormWatch, FieldValues, Path } from 'react-hook-form'
import LabelInput from '@/components/labelInput/LabelInput'
import styles from './accountInfoSection.module.scss'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useIdCheck } from '@/hooks/mutatate/useIdCheck'

export type AccountInfoSectionProps<T extends FieldValues> = {
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  watch: UseFormWatch<T>
  onIdError: (_isError: boolean) => void
}

function AccountInfoSection<T extends { id: string; password: string; confirmPassword: string } & FieldValues>({
  register,
  errors,
  watch,
  onIdError,
}: AccountInfoSectionProps<T>) {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const [idMessage, setIdMessage] = useState<string | undefined>(undefined)
  const [isIdError, setIsIdError] = useState(false)

  const watchPassword = watch('password' as Path<T>)
  const watchConfirmPassword = watch('confirmPassword' as Path<T>)

  const { mutate: checkId } = useIdCheck({
    onSuccess: data => {
      if (data.isAvailable) {
        setIdMessage('가입이 가능한 아이디 입니다.')
        setIsIdError(false)
        onIdError(false)
      } else {
        setIdMessage('이미 존재하는 아이디 입니다.')
        setIsIdError(true)
        onIdError(true)
      }
    },
    onError: message => {
      setIdMessage(message)
      setIsIdError(true)
      onIdError(true)
    },
  })

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // 한글 제거 (영문과 숫자만 허용)
    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, '')

    if (value !== filteredValue) {
      e.target.value = filteredValue
      value = filteredValue
    }

    setIdMessage(undefined)
    setIsIdError(false)
    onIdError(false)

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      if (value && value.length >= 5) {
        checkId({ userAccount: value })
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

  const getPasswordMessage = () => {
    if (errors.password) return (errors.password as any).message
    if (watchPassword && !errors.password) return '비밀번호 사용이 가능합니다.'
    return undefined
  }

  const getConfirmPasswordMessage = () => {
    if (errors.confirmPassword) return (errors.confirmPassword as any).message
    if (watchConfirmPassword && watchPassword === watchConfirmPassword) return '비밀번호 확인이 되었습니다.'
    return undefined
  }

  return (
    <section className={styles['account-info-section']}>
      <h2 className={styles.title}>로그인 계정</h2>
      {!isMobile && <Divider padding={1} />}
      <LabelInput
        label='아이디'
        placeholder='영문 대/소문자, 숫자 사용 가능 (5자 이상)'
        {...register('id' as Path<T>, {
          onChange: handleIdChange,
        })}
        isError={!!errors.id || isIdError}
        message={(errors.id as any)?.message || idMessage}
      />
      <LabelInput
        label='비밀번호'
        type='password'
        placeholder='8~16자 영문 소문자/숫자/특수문자만 가능합니다.'
        {...register('password' as Path<T>)}
        isError={!!errors.password}
        message={getPasswordMessage()}
      />
      <LabelInput
        label='비밀번호 확인'
        type='password'
        placeholder='비밀번호를 다시 입력해주세요.'
        {...register('confirmPassword' as Path<T>)}
        isError={!!errors.confirmPassword}
        message={getConfirmPasswordMessage()}
      />
    </section>
  )
}

export default AccountInfoSection
