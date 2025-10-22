import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { accountEditSchema, type AccountEditFormData } from './accountEditSchema'
import styles from './accountEdit.module.scss'
import PasswordChangeSection from '@/container/mypage/passwordChangeSection/PasswordChangeSection'
import EmailEditSection from '@/container/mypage/emailEditSection/EmailEditSection'
import PhoneVerificationEditSection from '@/container/mypage/phoneVerificationEditSection/PhoneVerificationEditSection'
import Button from '@/components/button/Button'
import { useGetUserProfile, useUpdateUserProfile, usePasswordCheck } from '@/hooks/queries/useAuth'
import { LOCAL } from '@/constants/local'
import { QUERY_KEY } from '@/constants/queryKey'
import type { UserProfileUpdateRequest } from '@/types/authTypes'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/toast/Toast'

const AccountEdit = () => {
  const [isEmailError, setIsEmailError] = useState(false)
  const [_isPasswordError, setIsPasswordError] = useState(false)
  const [isPasswordChecked, setIsPasswordChecked] = useState(false)
  const [phoneVerificationKey, setPhoneVerificationKey] = useState(0)
  const { data: userProfile } = useGetUserProfile()
  const queryClient = useQueryClient()
  const toast = useToast()

  const { mutateAsync: updateProfile } = useUpdateUserProfile({
    onSuccess: () => {
      toast.success('변경이 완료되었습니다.')

      // 폼 초기화
      reset({
        email: userProfile?.userEmail || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        phoneNumber: '',
        verificationCode: '',
      })

      // 상태 초기화
      setIsPasswordChecked(false)
      setIsEmailError(false)
      setPhoneVerificationKey(prev => prev + 1)

      // sessionStorage 토큰 제거
      sessionStorage.removeItem(LOCAL.VERIFICATION_TOKEN)

      // 프로필 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER_PROFILE] })
    },
    onError: message => {
      toast.error(`정보 수정 실패: ${message}`)
    },
  })

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
    formState: { errors, isSubmitting },
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

  const onSubmit = async (data: AccountEditFormData) => {
    try {
      const updateData: UserProfileUpdateRequest = {}

      // 1. 비밀번호 변경 체크
      const isPasswordChange = data.currentPassword && data.newPassword && data.confirmNewPassword
      if (isPasswordChange) {
        if (!isPasswordChecked) {
          alert('현재 비밀번호 확인이 필요합니다.')
          return
        }
        updateData.currentPassword = data.currentPassword
        updateData.newPassword = data.newPassword
        updateData.newPasswordConfirm = data.confirmNewPassword
      }

      // 2. 휴대폰 번호 변경 체크
      const isPhoneChange = data.phoneNumber && data.verificationCode
      if (isPhoneChange) {
        const verificationToken = sessionStorage.getItem(LOCAL.VERIFICATION_TOKEN)
        if (!verificationToken) {
          alert('휴대폰 인증이 완료되지 않았습니다.')
          return
        }
        updateData.newPhone = data.phoneNumber
        updateData.verificationToken = verificationToken
      }

      // 3. 이메일 변경 체크
      const isEmailChange = data.email && data.email !== userProfile?.userEmail
      if (isEmailChange) {
        if (isEmailError) {
          alert('이메일 중복 확인이 필요합니다.')
          return
        }
        updateData.newEmail = data.email
      }

      // 변경할 항목이 없는 경우
      if (!isPasswordChange && !isPhoneChange && !isEmailChange) {
        alert('변경할 정보를 입력해주세요.')
        return
      }

      // API 호출
      await updateProfile(updateData)
    } catch (error) {
      console.error('계정 수정 실패:', error)
    }
  }

  const handlePasswordChecked = (isChecked: boolean) => {
    setIsPasswordChecked(isChecked)
    setIsPasswordError(!isChecked)
  }

  const { mutateAsync: checkPassword } = usePasswordCheck({
    onSuccess: () => {},
    onError: () => {},
  })

  const handleCheckPassword = async (password: string) => {
    const result = await checkPassword({ password })
    return result
  }

  return (
    <FormProvider {...methods}>
      <main className={`${styles['account-edit']}`}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles['account-edit-form-section']}>
          <PasswordChangeSection
            register={register}
            errors={errors}
            watch={watch}
            userId={userProfile?.userAccount}
            onPasswordError={setIsPasswordError}
            onPasswordChecked={handlePasswordChecked}
            onCheckPassword={handleCheckPassword}
          />
          <PhoneVerificationEditSection key={phoneVerificationKey} currentPhone={userProfile?.userPhone} />
          <EmailEditSection
            register={register}
            errors={errors}
            onEmailError={setIsEmailError}
            currentEmail={userProfile?.userEmail}
          />
          <Button type='submit' disabled={isSubmitting} className={styles['account-edit-button']}>
            {isSubmitting ? '수정 진행 중...' : '회원정보 및 비밀번호 변경 완료'}
          </Button>
        </form>
      </main>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </FormProvider>
  )
}

export default AccountEdit
