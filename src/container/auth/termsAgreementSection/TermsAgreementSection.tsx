import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import React from 'react'
import type { SignUpFormData } from '@/pages/auth/signUp/signUpForm/signUpSchema'
import styles from './termsAgreementSection.module.scss'
import Divider from '@/components/divider/Divider'
import CheckBox from '@/components/checkBox'

type TermsAgreementSectionProps = {
  register: UseFormRegister<SignUpFormData>
  errors: FieldErrors<SignUpFormData>
  setValue: UseFormSetValue<SignUpFormData>
  watch: UseFormWatch<SignUpFormData>
}

const TermsLink = ({ text = '[이용약관 보기]' }: { text?: string }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    // TODO: 이용약관 모달 또는 페이지 로직 구현
    alert(`${text} 클릭!`)
  }

  return (
    <a href='/' onClick={handleClick} className={styles['terms-link']}>
      {text}
    </a>
  )
}

const AgreementRow = ({
  name,
  label,
  register,
  link,
}: {
  name: keyof SignUpFormData
  label: string
  register: UseFormRegister<SignUpFormData>
  link?: React.ReactNode
}) => {
  return (
    <div className={styles['agreement-row']}>
      <span className={styles['label-text']}>{label}</span>
      <div className={styles['checkbox-container']}>
        {link}
        <CheckBox {...register(name)} />
      </div>
    </div>
  )
}

const TermsAgreementSection = ({ register, errors, setValue, watch }: TermsAgreementSectionProps) => {
  const watchAllAgreement = watch(['agreeToTerms', 'agreeToPrivacy', 'agreeToMarketing'])
  const isAllChecked = watchAllAgreement.every(Boolean)
  const hasError = errors.agreeToTerms || errors.agreeToPrivacy

  const handleAllAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    setValue('agreeToTerms', checked, { shouldValidate: true })
    setValue('agreeToPrivacy', checked, { shouldValidate: true })
    setValue('agreeToMarketing', checked)
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>올바로 서비스 이용약관 동의</h2>
      <Divider padding={1} />
      <div className={styles['checkbox-group']}>
        <AgreementRow name='agreeToTerms' label='서비스 이용약관 동의' register={register} link={<TermsLink />} />
        <AgreementRow
          name='agreeToPrivacy'
          label='개인정보 처리방침 동의'
          register={register}
          link={<TermsLink text='[개인정보 처리방침 보기]' />}
        />
        <AgreementRow
          name='agreeToMarketing'
          label='마케팅 정보 수신 동의'
          register={register}
          link={<TermsLink text='[마케팅 정보 수신 동의 보기]' />}
        />
      </div>
      <Divider padding={1} />
      <div className={styles['all-agree-container']}>
        <div className={styles['all-agree']}>
          <CheckBox checked={isAllChecked} onChange={handleAllAgreeChange} />
          <span className={styles['label-text']}>모두 동의</span>
        </div>
        {hasError && <p className={styles['error-message']}>약관 동의는 필수입니다.</p>}
      </div>
    </section>
  )
}

export default TermsAgreementSection
