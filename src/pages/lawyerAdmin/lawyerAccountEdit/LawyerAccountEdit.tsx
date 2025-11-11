import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
import { accountEditSchema, type AccountEditFormData } from '@/container/mypage/accountEdit/accountEditSchema'
import styles from './lawyerAccountEdit.module.scss'
import PasswordChangeSection from '@/container/mypage/passwordChangeSection/PasswordChangeSection'
import EmailEditSection from '@/container/mypage/emailEditSection/EmailEditSection'
import LawyerCertificationEdit from '@/container/lawyerAdmin/lawyerCertificationEdit/LawyerCertificationEdit'
import LawyerPhoneVerificationEdit from '@/container/lawyerAdmin/lawyerPhoneVerificationEdit/LawyerPhoneVerificationEdit'
import {
  useGetLawyerProfile,
  useUpdateLawyerProfile,
  useWithdrawLawyer,
  useLawyerPasswordCheck,
} from '@/hooks/queries/useAuth'
import { LOCAL } from '@/constants/local'
import type { LawyerProfileUpdateRequest } from '@/types/authTypes'
import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import WithdrawModal from '@/components/withdrawModal/WithdrawModal'
import { ROUTER } from '@/routes/routerConstant'

const LawyerAccountEdit = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isMypage = location.pathname === '/mypage'
  const [isEmailError, setIsEmailError] = useState(false)
  const [_isPasswordError, setIsPasswordError] = useState(false)
  const [isPasswordChecked, setIsPasswordChecked] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [withdrawReason, setWithdrawReason] = useState('')

  const { data: lawyerProfile } = useGetLawyerProfile()

  const { mutateAsync: updateProfile } = useUpdateLawyerProfile({
    onSuccess: data => {
      alert(`다음 정보가 수정되었습니다: ${data.updatedFields.join(', ')}`)
    },
    onError: message => {
      alert(`정보 수정 실패: ${message}`)
    },
  })

  const { mutate: withdrawLawyer, isPending: isWithdrawPending } = useWithdrawLawyer({
    onSuccess: () => {
      alert('변호사 탈퇴가 완료되었습니다.')
      localStorage.removeItem('accessToken')
      navigate(`${ROUTER.AUTH}`)
    },
    onError: (message: string) => {
      alert(message || '탈퇴 처리 중 오류가 발생했습니다.')
    },
  })

  const { mutateAsync: checkPassword } = useLawyerPasswordCheck({
    onSuccess: () => {
      // 성공 처리는 handleCheckPassword에서
    },
    onError: (message: string) => {
      alert(message || '비밀번호 확인에 실패했습니다.')
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
        lawyerBarExamType: lawyerProfile.lawyerBarExamType || '',
        lawyerBarExamNumber: lawyerProfile.lawyerBarExamNumber?.toString() || '',
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
      const isPhoneChange = (data as any).lawyerPhone && (data as any).lawyerVerificationCode
      if (isPhoneChange) {
        const verificationToken = sessionStorage.getItem(LOCAL.VERIFICATION_TOKEN)
        if (!verificationToken) {
          alert('휴대폰 인증이 완료되지 않았습니다.')
          return
        }
        updateData.newContact = (data as any).lawyerPhone
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

      // 6. 출신시험 유형 및 회차 변경 체크 (세트로 관리)
      const isExamTypeChange =
        (data as any).lawyerBarExamType && (data as any).lawyerBarExamType !== lawyerProfile?.lawyerBarExamType
      const isExamNumberChange =
        (data as any).lawyerBarExamNumber &&
        (data as any).lawyerBarExamNumber !== lawyerProfile?.lawyerBarExamNumber?.toString()

      // 출신시험 유형 또는 회차 중 하나라도 변경되면 둘 다 전송
      const isExamChange = isExamTypeChange || isExamNumberChange
      if (isExamChange) {
        if (!(data as any).lawyerBarExamType || !(data as any).lawyerBarExamNumber) {
          alert('출신시험 유형과 회차를 모두 선택해주세요.')
          return
        }
        updateData.newBarExamType = (data as any).lawyerBarExamType
        updateData.newBarExamNumber = Number((data as any).lawyerBarExamNumber)
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
    try {
      const result = await checkPassword({ password })
      return result
    } catch {
      return { isValid: false }
    }
  }

  const handleWithdraw = () => {
    withdrawLawyer({ reason: withdrawReason })
  }

  return (
    <FormProvider {...methods}>
      <main className={`${styles['account-edit']}`}>
        <HeaderPortal>
          <div className={styles.header}>
            <button
              type='button'
              disabled={isSubmitting}
              className={styles.header__button__item}
              onClick={() => setIsWithdrawModalOpen(true)}
            >
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
          <LawyerPhoneVerificationEdit currentPhone={lawyerProfile?.lawyerContact} />
          <LawyerCertificationEdit
            register={register as any}
            errors={errors}
            currentFirmContact={lawyerProfile?.lawyerLawfirmContact}
            currentBarExamType={lawyerProfile?.lawyerBarExamType}
            currentBarExamNumber={lawyerProfile?.lawyerBarExamNumber}
          />
          <EmailEditSection
            register={register}
            errors={errors}
            onEmailError={setIsEmailError}
            currentEmail={lawyerProfile?.lawyerEmail}
          />
        </form>
        {isMypage && (
          <div className={styles['account-edit-footer']}>
            <button
              type='button'
              className={styles['account-edit-footer__button']}
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? '수정 진행 중...' : '정보변경'}
            </button>
          </div>
        )}
      </main>
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title='변호사 탈퇴하기'
        noticeText={
          <>
            변호사 탈퇴를 선택할 경우
            <br />
            즉시 로그아웃 되며, 1주일 이내 담당자가 연락하여 탈퇴처리를 도와드립니다.
          </>
        }
        withdrawReason={withdrawReason}
        onReasonChange={setWithdrawReason}
        onConfirm={handleWithdraw}
        isPending={isWithdrawPending}
      />
    </FormProvider>
  )
}

export default LawyerAccountEdit
