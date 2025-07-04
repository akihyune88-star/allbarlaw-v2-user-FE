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

const SignUpForm = () => {
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
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = methods

  const onSubmit = (data: SignUpFormData) => {
    console.log('회원가입 전체 데이터:', data)
    return new Promise(resolve => setTimeout(resolve, 2000))
  }

  return (
    <FormProvider {...methods}>
      <main className={`${styles['sign-up-form']} center-layout`}>
        <SignUpTitle title='회원가입' />
        <form onSubmit={handleSubmit(onSubmit)} className={styles['sign-up-form-section']}>
          <div className={styles['input-section']}>
            <AccountInfoSection register={register} errors={errors} />
            <PhoneVerificationSection />
            <EmailInputSection register={register} errors={errors} />
          </div>
          <TermsAgreementSection register={register} errors={errors} setValue={setValue} watch={watch} />
          <Button type='submit' disabled={isSubmitting} className={styles['sign-up-form-button']}>
            {isSubmitting ? '가입 진행 중...' : '회원가입 완료'}
          </Button>
        </form>
      </main>
    </FormProvider>
  )
}

export default SignUpForm
