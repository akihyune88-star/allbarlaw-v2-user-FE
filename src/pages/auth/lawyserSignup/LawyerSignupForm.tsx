import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import styles from './lawyerSignupForm.module.scss'
import SignUpTitle from '@/container/auth/signUpTitle/SignUpTitle'
import AccountInfoSection from '@/container/auth/accountInfoSection/AccountInfoSection'
import EmailInputSection from '@/container/auth/emailInputSection/EmailInputSection'
import TermsAgreementSection from '@/container/auth/termsAgreementSection/TermsAgreementSection'
import Button from '@/components/button/Button'
import { lawyerSignupSchema, type LawyerSignupFormData } from './lawyerSignupSchema'
import LawyerCertification from '@/container/auth/lawyerCertification/LawyerCertification'
import { AlertModal } from '@/components/modal/Modal'
import { useLawyerSignUp } from '@/hooks/queries/useLawyer'
import { ROUTER } from '@/routes/routerConstant'

const LawyerSignupForm = () => {
  const navigate = useNavigate()
  const [isEmailError, setIsEmailError] = useState(false)
  const [isIdError, setIsIdError] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const methods = useForm<LawyerSignupFormData>({
    resolver: zodResolver(lawyerSignupSchema),
    mode: 'onChange',
    defaultValues: {
      agreeToMarketing: false,
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
  } = methods

  const { mutate: signUpLawyer } = useLawyerSignUp({
    onSuccess: () => {
      setAlertMessage(
        '변호사 가입신청이 완료되었습니다.\n곧 담당자가 증빙자료 제출을 위해 연락드릴 예정입니다.\n이후 정상적으로 서비스 이용이 가능합니다.\n\n문의사항이 있으실 경우 아래의 번호로 연락주시기 바랍니다.\n010-2029-4962'
      )
      setAlertOpen(true)
      setTimeout(() => {
        navigate(ROUTER.MAIN)
      }, 2000)
    },
    onError: errorMessage => {
      setAlertMessage(`${errorMessage}\n다시 시도해주세요.`)
      setAlertOpen(true)
    },
  })

  const onSubmit = async (data: LawyerSignupFormData) => {
    signUpLawyer({
      lawyerAccount: data.id,
      lawyerPassword: data.password,
      lawyerPasswordRepeat: data.confirmPassword,
      lawyerName: data.lawyerName,
      lawyerContact: data.lawyerContact,
      lawyerLawfirmName: data.lawyerFirm,
      lawyerBarExamType: data.lawyerBarExamType as
        | 'JUDICIAL_EXAM'
        | 'LAWYER_EXAM'
        | 'MILITARY_EXAM'
        | 'HIGHER_CIVIL_EXAM',
      lawyerBarExamNumber: data.lawyerBarExamNumber,
      lawyerEmail: data.email,
    })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    if (isEmailError) {
      e.preventDefault()
      setAlertMessage('이미 등록된 이메일입니다.')
      setAlertOpen(true)
      return
    }
    if (isIdError) {
      e.preventDefault()
      setAlertMessage('이미 존재하는 아이디입니다.')
      setAlertOpen(true)
      return
    }
    handleSubmit(onSubmit)(e)
  }

  return (
    <>
      <FormProvider {...methods}>
        <main className={`${styles['lawyer-signup-form']} center-layout`}>
          <SignUpTitle title='변호사 회원가입' />
          <form onSubmit={handleFormSubmit} className={styles['lawyer-signup-form-section']}>
            <AccountInfoSection register={register} errors={errors} watch={watch} onIdError={setIsIdError} />
            <LawyerCertification register={register} errors={errors} />
            <EmailInputSection register={register} errors={errors} onEmailError={setIsEmailError} />
            <TermsAgreementSection register={register} errors={errors} setValue={setValue} watch={watch} />
            <Button
              type='submit'
              disabled={isSubmitting || !isValid || isEmailError || isIdError}
              className={styles['lawyer-signup-form-button']}
            >
              {isSubmitting ? '가입 진행 중...' : '회원가입 완료'}
            </Button>
          </form>
        </main>
      </FormProvider>
      <AlertModal isOpen={alertOpen} onClose={() => setAlertOpen(false)} message={alertMessage} confirmText='확인' />
    </>
  )
}

export default LawyerSignupForm
