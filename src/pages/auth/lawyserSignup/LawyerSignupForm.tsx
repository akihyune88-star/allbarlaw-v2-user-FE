import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import styles from './lawyerSignupForm.module.scss'
import SignUpTitle from '@/container/auth/signUpTitle/SignUpTitle'
import AccountInfoSection from '@/container/auth/accountInfoSection/AccountInfoSection'
import EmailInputSection from '@/container/auth/emailInputSection/EmailInputSection'
import TermsAgreementSection from '@/container/auth/termsAgreementSection/TermsAgreementSection'
import Button from '@/components/button/Button'
import { lawyerSignupSchema, type LawyerSignupFormData } from './lawyerSignupSchema'
import LawyerCertification from '@/container/auth/lawyerCertification/LawyerCertification'

const LawyerSignupForm = () => {
  const [isEmailError, setIsEmailError] = useState(false)
  const [isIdError, setIsIdError] = useState(false)
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

  const onSubmit = async (_data: LawyerSignupFormData) => {
    // try {
    //   const verificationToken = sessionStorage.getItem(LOCAL.VERIFICATION_TOKEN)
    //   if (!verificationToken) {
    //     alert('휴대폰 인증이 완료되지 않았습니다.')
    //     return
    //   }
    //   await signUp({
    //     account: data.id,
    //     password: data.password,
    //     passwordRepeat: data.confirmPassword,
    //     email: data.email,
    //     phone: data.phoneNumber,
    //     verificationToken: verificationToken,
    //   })
    //   navigate(ROUTER.AUTH)
    // } catch (error) {
    //   console.error('회원가입 실패:', error)
    // }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    if (isEmailError) {
      e.preventDefault()
      alert('이미 등록된 이메일입니다.')
      return
    }
    if (isIdError) {
      e.preventDefault()
      alert('이미 존재하는 아이디입니다.')
      return
    }
    handleSubmit(onSubmit)(e)
  }

  return (
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
  )
}

export default LawyerSignupForm
