import React, { useEffect, useRef, useState } from 'react'
import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form'
import LabelInput from '@/components/labelInput/LabelInput'
import type { SignUpFormData } from '@/pages/auth/signUp/signUpForm/signUpSchema'
import styles from './accountInfoSection.module.scss'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useIdCheck } from '@/hooks/mutatate/useIdCheck'

type AccountInfoSectionProps = {
  register: UseFormRegister<SignUpFormData>
  errors: FieldErrors<SignUpFormData>
  watch: UseFormWatch<SignUpFormData>
}

const AccountInfoSection = ({ register, errors, watch }: AccountInfoSectionProps) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const [idMessage, setIdMessage] = useState<string | undefined>(undefined)
  const [isIdError, setIsIdError] = useState(false)

  const watchPassword = watch('password')
  const watchConfirmPassword = watch('confirmPassword')

  const { mutate: checkId } = useIdCheck({
    onSuccess: data => {
      if (data.isAvailable) {
        setIdMessage('가입이 가능한 아이디 입니다.')
        setIsIdError(false)
      } else {
        setIdMessage('이미 존재하는 아이디 입니다.')
        setIsIdError(true)
      }
    },
    onError: message => {
      setIdMessage(message)
      setIsIdError(true)
    },
  })

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setIdMessage(undefined)
    setIsIdError(false)

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
    if (errors.password) return errors.password.message
    if (watchPassword && !errors.password) return '비밀번호 사용이 가능합니다.'
    return undefined
  }

  const getConfirmPasswordMessage = () => {
    if (errors.confirmPassword) return errors.confirmPassword.message
    if (watchConfirmPassword && watchPassword === watchConfirmPassword) return '비밀번호 확인이 되었습니다.'
    return undefined
  }

  return (
    <section className={styles['account-info-section']}>
      <h2 className={styles.title}>로그인 계정</h2>
      {!isMobile && <Divider padding={1} />}
      <LabelInput
        label='아이디'
        placeholder='영문, 숫자 포함 5자 이상 가능합니다.'
        {...register('id', {
          onChange: handleIdChange,
        })}
        isError={!!errors.id || isIdError}
        message={errors.id?.message || idMessage}
      />
      <LabelInput
        label='비밀번호'
        type='password'
        placeholder='8자 이상 입력해주세요'
        {...register('password')}
        isError={!!errors.password}
        message={getPasswordMessage()}
      />
      <LabelInput
        label='비밀번호 확인'
        type='password'
        placeholder='비밀번호를 다시 입력해주세요.'
        {...register('confirmPassword')}
        isError={!!errors.confirmPassword}
        message={getConfirmPasswordMessage()}
      />
    </section>
  )
}

export default AccountInfoSection
