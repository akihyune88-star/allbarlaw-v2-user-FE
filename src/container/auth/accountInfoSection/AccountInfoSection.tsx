import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import LabelInput from '@/components/labelInput/LabelInput'
import type { SignUpFormData } from '@/pages/auth/signUp/signUpForm/signUpSchema'
import styles from './accountInfoSection.module.scss'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'

type AccountInfoSectionProps = {
  register: UseFormRegister<SignUpFormData>
  errors: FieldErrors<SignUpFormData>
  idMessage?: string
}

const AccountInfoSection = ({ register, errors, idMessage }: AccountInfoSectionProps) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  return (
    <section className={styles['account-info-section']}>
      <h2 className={styles.title}>로그인 계정</h2>
      {!isMobile && <Divider padding={1} />}
      <LabelInput
        label='아이디'
        placeholder='영문, 숫자 포함 5자 이상 가능합니다.'
        {...register('id')}
        isError={!!errors.id}
        message={idMessage}
      />
      <LabelInput
        label='비밀번호'
        type='password'
        placeholder='8자 이상 입력해주세요'
        {...register('password')}
        isError={!!errors.password}
        message={errors.password?.message}
      />
      <LabelInput
        label='비밀번호 확인'
        type='password'
        placeholder='비밀번호를 다시 입력해주세요.'
        {...register('confirmPassword')}
        isError={!!errors.confirmPassword}
        message={errors.confirmPassword?.message}
      />
    </section>
  )
}

export default AccountInfoSection
