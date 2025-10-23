import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { accountEditSchema, type AccountEditFormData } from '@/container/mypage/accountEdit/accountEditSchema'
import styles from './lawyerAccountEdit.module.scss'
import PasswordChangeSection from '@/container/mypage/passwordChangeSection/PasswordChangeSection'
import EmailEditSection from '@/container/mypage/emailEditSection/EmailEditSection'
import LawyerCertificationEdit from '@/container/lawyerAdmin/lawyerCertificationEdit/LawyerCertificationEdit'
import { useGetLawyerProfile, useUpdateLawyerProfile } from '@/hooks/queries/useAuth'
import { LOCAL } from '@/constants/local'
import type { LawyerProfileUpdateRequest } from '@/types/authTypes'
import HeaderPortal from '@/components/headerPortal/HeaderPortal'

const LawyerAccountEdit = () => {
  const [isEmailError, setIsEmailError] = useState(false)
  const [_isPasswordError, setIsPasswordError] = useState(false)
  const [isPasswordChecked, setIsPasswordChecked] = useState(false)

  const { data: lawyerProfile } = useGetLawyerProfile()

  const { mutateAsync: updateProfile } = useUpdateLawyerProfile({
    onSuccess: data => {
      alert(`다음 정보가 수정되었습니다: ${data.updatedFields.join(', ')}`)
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
    if (lawyerProfile) {
      reset({
        email: lawyerProfile.lawyerEmail,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        phoneNumber: '',
        verificationCode: '',
        lawyerFirm: lawyerProfile.lawyerLawfirmName || '',
        lawyerFirmContact: lawyerProfile.lawyerLawfirmContact || '',
        lawyerExam: lawyerProfile.lawyerBarExamNumber?.toString() || '',
      } as any)
    }
  }, [lawyerProfile, reset])

  const onSubmit = async (data: AccountEditFormData) => {
    try {
      const updateData: Partial<LawyerProfileUpdateRequest> = {}

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
        updateData.newContact = data.phoneNumber
        updateData.verificationToken = verificationToken
      }

      // 3. 이메일 변경 체크
      const isEmailChange = data.email && data.email !== lawyerProfile?.lawyerEmail
      if (isEmailChange) {
        if (isEmailError) {
          alert('이메일 중복 확인이 필요합니다.')
          return
        }
        updateData.newEmail = data.email
      }

      // 4. 로펌명 변경 체크
      const isFirmChange = (data as any).lawyerFirm && (data as any).lawyerFirm !== lawyerProfile?.lawyerLawfirmName
      if (isFirmChange) {
        updateData.newLawfirmName = (data as any).lawyerFirm
      }

      // 5. 로펌 연락처 변경 체크
      const isFirmContactChange =
        (data as any).lawyerFirmContact && (data as any).lawyerFirmContact !== lawyerProfile?.lawyerLawfirmContact
      if (isFirmContactChange) {
        updateData.newLawfirmContact = (data as any).lawyerFirmContact
      }

      // 6. 출신시험 변경 체크
      const isExamChange =
        (data as any).lawyerExam && (data as any).lawyerExam !== lawyerProfile?.lawyerBarExamNumber?.toString()
      if (isExamChange) {
        updateData.newBarExamNumber = Number((data as any).lawyerExam)
      }

      // 변경할 항목이 없는 경우
      if (
        !isPasswordChange &&
        !isPhoneChange &&
        !isEmailChange &&
        !isFirmChange &&
        !isFirmContactChange &&
        !isExamChange
      ) {
        alert('변경할 정보를 입력해주세요.')
        return
      }

      // API 호출
      await updateProfile(updateData as LawyerProfileUpdateRequest)
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
              <button
                type='button'
                disabled={isSubmitting}
                className={styles.header__button__item}
                onClick={handleSubmit(onSubmit)}
              >
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
            userId={lawyerProfile?.lawyerAccount}
            onPasswordError={setIsPasswordError}
            onPasswordChecked={handlePasswordChecked}
            onCheckPassword={handleCheckPassword}
          />
          <LawyerCertificationEdit
            register={register as any}
            errors={errors}
            currentPhone={lawyerProfile?.lawyerContact}
            currentFirmContact={lawyerProfile?.lawyerLawfirmContact}
            onPhoneVerification={handlePhoneVerification}
          />
          <EmailEditSection
            register={register}
            errors={errors}
            onEmailError={setIsEmailError}
            currentEmail={lawyerProfile?.lawyerEmail}
          />
        </form>
      </main>
    </FormProvider>
  )
}

export default LawyerAccountEdit
