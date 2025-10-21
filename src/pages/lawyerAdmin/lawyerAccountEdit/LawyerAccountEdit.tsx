import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { accountEditSchema, type AccountEditFormData } from '@/container/mypage/accountEdit/accountEditSchema'
import styles from './lawyerAccountEdit.module.scss'
import PasswordChangeSection from '@/container/mypage/passwordChangeSection/PasswordChangeSection'
import EmailEditSection from '@/container/mypage/emailEditSection/EmailEditSection'
import PhoneVerificationEditSection from '@/container/mypage/phoneVerificationEditSection/PhoneVerificationEditSection'
import LawyerCertificationEdit from '@/container/lawyerAdmin/lawyerCertificationEdit/LawyerCertificationEdit'
import Button from '@/components/button/Button'
import { useGetUserProfile, useUpdateUserProfile } from '@/hooks/queries/useAuth'
import { LOCAL } from '@/constants/local'
import type { UserProfileUpdateRequest } from '@/types/authTypes'
import HeaderPortal from '@/components/headerPortal/HeaderPortal'

const LawyerAccountEdit = () => {
  const [isEmailError, setIsEmailError] = useState(false)
  const [_isPasswordError, setIsPasswordError] = useState(false)
  const [isPasswordChecked, setIsPasswordChecked] = useState(false)

  // TODO: 변호사용 프로필 API가 추가되면 useGetLawyerProfile로 변경 필요
  const { data: userProfile } = useGetUserProfile()

  const { mutateAsync: updateProfile } = useUpdateUserProfile({
    onSuccess: data => {
      alert(`다음 정보가 수정되었습니다: ${data.updatedFields.join(', ')}`)
      window.location.reload()
    },
    onError: message => {
      alert(`정보 수정 실패: ${message}`)
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
        updateData.certNumber = data.verificationCode
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

  const handleCheckPassword = async (password: string): Promise<{ isValid: boolean }> => {
    // TODO: 실제 비밀번호 확인 API로 교체
    const isValid = typeof password === 'string' && password.length >= 8
    return { isValid }
  }

  const handlePhoneVerification = () => {
    // TODO: 휴대폰 본인인증 모달 또는 인증 프로세스 시작
    alert('휴대폰 본인인증 기능은 준비 중입니다.')
  }

  return (
    <FormProvider {...methods}>
      <main className={`${styles['account-edit']}`}>
        <HeaderPortal>
          <div className={styles.header}>
            <button type='button' disabled={isSubmitting} className={styles.header__button__item}>
              탈퇴 하기
            </button>
            <nav className={styles.header__button}>
              <button type='button' disabled={isSubmitting} className={styles.header__button__item}>
                취소
              </button>
              <button type='submit' disabled={isSubmitting} className={styles.header__button__item}>
                {isSubmitting ? '수정 진행 중...' : '변경'}
              </button>
            </nav>
          </div>
        </HeaderPortal>
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
          <LawyerCertificationEdit
            register={register as any}
            errors={errors}
            currentPhone={userProfile?.userPhone}
            onPhoneVerification={handlePhoneVerification}
          />
          <EmailEditSection
            register={register}
            errors={errors}
            onEmailError={setIsEmailError}
            currentEmail={userProfile?.userEmail}
          />
        </form>
      </main>
    </FormProvider>
  )
}

export default LawyerAccountEdit
