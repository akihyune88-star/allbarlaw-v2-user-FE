import React, { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { accountEditSchema, type AccountEditFormData } from './accountEditSchema'
import styles from './accountEdit.module.scss'
import PasswordChangeSection from '@/container/mypage/passwordChangeSection/PasswordChangeSection'
import EmailEditSection from '@/container/mypage/emailEditSection/EmailEditSection'
import PhoneVerificationEditSection from '@/container/mypage/phoneVerificationEditSection/PhoneVerificationEditSection'
import Button from '@/components/button/Button'
import { useGetUserProfile } from '@/hooks/queries/useAuth'
import { LOCAL } from '@/constants/local'

const AccountEdit = () => {
  const [isEmailError, setIsEmailError] = useState(false)
  const [isPasswordError, setIsPasswordError] = useState(false)
  const { data: userProfile } = useGetUserProfile()

  const methods = useForm<AccountEditFormData>({
    resolver: zodResolver(accountEditSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    reset,
  } = methods

  useEffect(() => {
    if (userProfile) {
      reset({
        email: userProfile.userEmail,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        phoneNumber: '',
        verificationCode: '',
      })
    }
  }, [userProfile, reset])

  // TODO: useAccountUpdate 훅을 생성하여 API 연동 필요
  const onSubmit = async (data: AccountEditFormData) => {
    try {
      const verificationToken = sessionStorage.getItem(LOCAL.VERIFICATION_TOKEN)
      if (!verificationToken) {
        alert('휴대폰 인증이 완료되지 않았습니다.')
        return
      }

      // API 호출 예시:
      // await updateAccount({
      //   currentPassword: data.currentPassword,
      //   newPassword: data.newPassword,
      //   passwordRepeat: data.confirmNewPassword,
      //   email: data.email,
      //   phone: data.phoneNumber,
      //   verificationToken: verificationToken,
      // })
      console.log('계정 수정 데이터:', data)
      alert('계정 정보가 성공적으로 수정되었습니다.')
    } catch (error) {
      console.error('계정 수정 실패:', error)
      alert('계정 정보 수정에 실패했습니다.')
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    if (isEmailError) {
      e.preventDefault()
      alert('이미 등록된 이메일입니다.')
      return
    }
    if (isPasswordError) {
      e.preventDefault()
      alert('현재 비밀번호가 일치하지 않습니다.')
      return
    }
    handleSubmit(onSubmit)(e)
  }

  return (
    <FormProvider {...methods}>
      <main className={`${styles['account-edit']}`}>
        <form onSubmit={handleFormSubmit} className={styles['account-edit-form-section']}>
          <PasswordChangeSection
            register={register}
            errors={errors}
            watch={watch}
            userId={userProfile?.userAccount}
            onPasswordError={setIsPasswordError}
          />
          <PhoneVerificationEditSection currentPhone={userProfile?.userPhone} />
          <EmailEditSection
            register={register}
            errors={errors}
            onEmailError={setIsEmailError}
            currentEmail={userProfile?.userEmail}
          />
          <Button
            type='submit'
            disabled={isSubmitting || !isValid || isEmailError || isPasswordError}
            className={styles['account-edit-button']}
          >
            {isSubmitting ? '수정 진행 중...' : '회원정보 및 비밀번호 변경 완료'}
          </Button>
        </form>
      </main>
    </FormProvider>
  )
}

export default AccountEdit
