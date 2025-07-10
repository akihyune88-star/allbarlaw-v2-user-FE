import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { signUpSchema, type SignUpFormData } from './signUpSchema'
import SignUpTitle from '@/container/auth/signUpTitle/SignUpTitle'
import styles from './signUpForm.module.scss'
import AccountInfoSection from '@/container/auth/accountInfoSection/AccountInfoSection'
import PhoneVerificationSection from '@/container/auth/phoneVerificationSection/PhoneVerificationSection'
import TermsAgreementSection from '@/container/auth/termsAgreementSection/TermsAgreementSection'
import EmailInputSection from '@/container/auth/emailInputSection/EmailInputSection'
import Button from '@/components/button/Button'
import { useSignUp } from '@/hooks/mutatate/useSignUp'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import { LOCAL } from '@/constants/local'

const SignUpForm = () => {
  const [isEmailError, setIsEmailError] = useState(false)
  const [isIdError, setIsIdError] = useState(false)
  const methods = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
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

  const { mutateAsync: signUp } = useSignUp()
  const navigate = useNavigate()

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const verificationToken = sessionStorage.getItem(LOCAL.VERIFICATION_TOKEN)
      if (!verificationToken) {
        alert('휴대폰 인증이 완료되지 않았습니다.')
        return
      }

      await signUp({
        account: data.id,
        password: data.password,
        passwordRepeat: data.confirmPassword,
        email: data.email,
        phone: data.phoneNumber,
        verificationToken: verificationToken,
      })
      navigate(ROUTER.AUTH)
    } catch (error) {
      console.error('회원가입 실패:', error)
    }
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
      <main className={`${styles['sign-up-form']} center-layout`}>
        <SignUpTitle title='회원가입' />
        <form onSubmit={handleFormSubmit} className={styles['sign-up-form-section']}>
          <AccountInfoSection register={register} errors={errors} watch={watch} onIdError={setIsIdError} />
          <PhoneVerificationSection />
          <EmailInputSection register={register} errors={errors} onEmailError={setIsEmailError} />
          <TermsAgreementSection register={register} errors={errors} setValue={setValue} watch={watch} />
          <Button
            type='submit'
            disabled={isSubmitting || !isValid || isEmailError || isIdError}
            className={styles['sign-up-form-button']}
          >
            {isSubmitting ? '가입 진행 중...' : '회원가입 완료'}
          </Button>
        </form>
      </main>
    </FormProvider>
  )
}

export default SignUpForm
