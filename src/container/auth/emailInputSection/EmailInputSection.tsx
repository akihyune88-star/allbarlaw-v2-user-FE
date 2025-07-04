import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import LabelInput from '@/components/labelInput/LabelInput'
import type { SignUpFormData } from '@/pages/auth/signUp/signUpForm/signUpSchema'
import styles from './emailInputSection.module.scss'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'

type EmailInputSectionProps = {
  register: UseFormRegister<SignUpFormData>
  errors: FieldErrors<SignUpFormData>
}

const EmailInputSection = ({ register, errors }: EmailInputSectionProps) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>이메일 주소 - 계정 분실시 필요</h2>
      {!isMobile && <Divider padding={1} />}
      <LabelInput
        label='이메일'
        placeholder='이메일을 입력해주세요'
        {...register('email')}
        isError={!!errors.email}
        message={errors.email?.message}
      />
    </section>
  )
}

export default EmailInputSection
