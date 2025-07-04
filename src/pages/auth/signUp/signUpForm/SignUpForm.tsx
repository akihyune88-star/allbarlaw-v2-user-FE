import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, type SignUpFormData } from './signUpSchema'
import SignUpTitle from '@/container/auth/signUpTitle/SignUpTitle'
import styles from './signUpForm.module.scss'
import AccountInfoSection from '@/container/auth/accountInfoSection/AccountInfoSection'
import PhoneVerificationSection from '@/container/auth/phoneVerificationSection/PhoneVerificationSection'
import TermsAgreementSection from '@/container/auth/termsAgreementSection/TermsAgreementSection'
import EmailInputSection from '@/container/auth/emailInputSection/EmailInputSection'

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      agreeToMarketing: false,
    },
  })

  const idValue = watch('id')

  const idMessage = errors.id ? errors.id.message : dirtyFields.id && idValue ? '사용 가능한 아이디입니다.' : ''

  const onSubmit: SubmitHandler<SignUpFormData> = data => {
    console.log('회원가입 전체 데이터:', data)
    return new Promise(resolve => setTimeout(resolve, 2000))
  }

  return (
    <main className={`${styles['sign-up-form']} center-layout`}>
      <SignUpTitle title='회원가입' />
      <form className={styles['sign-up-form-section']} onSubmit={handleSubmit(onSubmit)}>
        <AccountInfoSection register={register} errors={errors} idMessage={idMessage} />
        <PhoneVerificationSection register={register} errors={errors} />
        <EmailInputSection register={register} errors={errors} />
        <TermsAgreementSection register={register} errors={errors} setValue={setValue} watch={watch} />
        <button type='submit' disabled={isSubmitting} className={styles['sign-up-form-button']}>
          {isSubmitting ? '가입 진행 중...' : '회원가입 완료'}
        </button>
      </form>
    </main>
  )
}

export default SignUpForm
