import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import LabelInput from '@/components/labelInput/LabelInput'
import type { SignUpFormData } from '@/pages/auth/signUp/signUpForm/signUpSchema'
import styles from './phoneVerificationSection.module.scss'
import Divider from '@/components/divider/Divider'

type PhoneVerificationSectionProps = {
  register: UseFormRegister<SignUpFormData>
  errors: FieldErrors<SignUpFormData>
}

const PhoneVerificationSection = ({ register, errors }: PhoneVerificationSectionProps) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>휴대폰 인증</h2>
      <Divider padding={1} />
      <LabelInput
        label='휴대폰 번호'
        placeholder="'-' 없이 숫자만 입력"
        maxLength={11}
        {...register('phoneNumber')}
        isError={!!errors.phoneNumber}
        message={errors.phoneNumber?.message}
      />
      <LabelInput
        label='인증번호'
        placeholder='인증번호 6자리 입력'
        maxLength={6}
        {...register('verificationCode')}
        isError={!!errors.verificationCode}
        message={errors.verificationCode?.message}
      />
    </section>
  )
}

export default PhoneVerificationSection
