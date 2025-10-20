import React, { useEffect, useRef, useState } from 'react'
import type { UseFormRegister, FieldErrors, UseFormWatch, FieldValues, Path } from 'react-hook-form'
import LabelInput from '@/components/labelInput/LabelInput'
import styles from './passwordChangeSection.module.scss'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePasswordCheck } from '@/hooks/queries/useAuth'

export type PasswordChangeSectionProps<T extends FieldValues> = {
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  watch: UseFormWatch<T>
  userId?: string
  onPasswordError?: (_isError: boolean) => void
  onPasswordChecked?: (_isChecked: boolean) => void
}

function PasswordChangeSection<
  T extends { currentPassword?: string; newPassword?: string; confirmNewPassword?: string } & FieldValues
>({ register, errors, watch, userId, onPasswordError, onPasswordChecked }: PasswordChangeSectionProps<T>) {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const [passwordMessage, setPasswordMessage] = useState<string | undefined>(undefined)
  const [isPasswordError, setIsPasswordError] = useState(false)

  const watchNewPassword = watch('newPassword' as Path<T>)
  const watchConfirmNewPassword = watch('confirmNewPassword' as Path<T>)

  const { mutate: checkPassword } = usePasswordCheck({
    onSuccess: data => {
      if (data.isValid) {
        setPasswordMessage('현재 비밀번호가 확인되었습니다.')
        setIsPasswordError(false)
        onPasswordError?.(false)
        onPasswordChecked?.(true)
      } else {
        setPasswordMessage('현재 비밀번호가 일치하지 않습니다.')
        setIsPasswordError(true)
        onPasswordError?.(true)
        onPasswordChecked?.(false)
      }
    },
    onError: message => {
      setPasswordMessage(message)
      setIsPasswordError(true)
      onPasswordError?.(true)
      onPasswordChecked?.(false)
    },
  })

  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setPasswordMessage(undefined)
    setIsPasswordError(false)
    onPasswordError?.(false)
    onPasswordChecked?.(false)

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      if (value && value.length >= 8) {
        checkPassword({ password: value })
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

  const getNewPasswordMessage = () => {
    if (errors.newPassword) return (errors.newPassword as any).message
    if (watchNewPassword && !errors.newPassword) return '비밀번호 사용이 가능합니다.'
    return undefined
  }

  const getConfirmNewPasswordMessage = () => {
    if (errors.confirmNewPassword) return (errors.confirmNewPassword as any).message
    if (watchConfirmNewPassword && watchNewPassword === watchConfirmNewPassword) return '비밀번호 확인이 되었습니다.'
    return undefined
  }

  const getCurrentPasswordMessage = () => {
    if (errors.currentPassword) return (errors.currentPassword as any).message
    return passwordMessage
  }

  return (
    <section className={styles['password-change-section']}>
      <h2 className={styles.title}>비밀번호 변경</h2>
      {!isMobile && <Divider padding={1} />}
      <div className={styles['user-id-display']}>
        <div className={styles['field-container']}>
          <label className={styles['label']}>아이디</label>
          <div className={styles['text-value']}>{userId || '-'}</div>
        </div>
      </div>
      <LabelInput
        label='현재 비밀번호'
        type='password'
        placeholder='현재 비밀번호를 입력해주세요.'
        {...register('currentPassword' as Path<T>, {
          onChange: handleCurrentPasswordChange,
        })}
        isError={!!errors.currentPassword || isPasswordError}
        message={getCurrentPasswordMessage()}
      />
      <LabelInput
        label='새 비밀번호'
        type='password'
        placeholder='8~16자 영문 소문자/숫자/특수문자만 가능합니다.'
        {...register('newPassword' as Path<T>)}
        isError={!!errors.newPassword}
        message={getNewPasswordMessage()}
      />
      <LabelInput
        label='새 비밀번호 확인'
        type='password'
        placeholder='비밀번호를 다시 입력해주세요.'
        {...register('confirmNewPassword' as Path<T>)}
        isError={!!errors.confirmNewPassword}
        message={getConfirmNewPasswordMessage()}
      />
    </section>
  )
}

export default PasswordChangeSection
