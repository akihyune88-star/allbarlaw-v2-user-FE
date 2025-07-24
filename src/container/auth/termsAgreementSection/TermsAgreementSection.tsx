import { FieldValues, Path, UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import React from 'react'
import styles from './termsAgreementSection.module.scss'
import Divider from '@/components/divider/Divider'
import CheckBox from '@/components/checkBox'

export type TermsAgreementSectionProps<T extends FieldValues> = {
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  setValue: UseFormSetValue<T>
  watch: UseFormWatch<T>
}

const TermsLink = ({ text = '[이용약관 보기]' }: { text?: string }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    alert(`${text} 클릭!`)
  }
  return (
    <a href='/' onClick={handleClick} className={styles['terms-link']}>
      {text}
    </a>
  )
}

const AgreementRow = <T extends FieldValues>({
  name,
  label,
  register,
  link,
}: {
  name: Path<T>
  label: string
  register: UseFormRegister<T>
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

function TermsAgreementSection<
  T extends { agreeToTerms: boolean; agreeToPrivacy: boolean; agreeToMarketing?: boolean } & FieldValues
>({ register, errors, setValue, watch }: TermsAgreementSectionProps<T>) {
  const watchAllAgreement = watch(['agreeToTerms', 'agreeToPrivacy', 'agreeToMarketing'].map(k => k as Path<T>))
  const isAllChecked = Array.isArray(watchAllAgreement) && watchAllAgreement.every(Boolean)
  const hasError = errors.agreeToTerms || errors.agreeToPrivacy

  const handleAllAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    setValue('agreeToTerms' as Path<T>, checked as any, { shouldValidate: true })
    setValue('agreeToPrivacy' as Path<T>, checked as any, { shouldValidate: true })
    setValue('agreeToMarketing' as Path<T>, checked as any)
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>올바로 서비스 이용약관 동의</h2>
      <Divider padding={1} />
      <div className={styles['checkbox-group']}>
        <AgreementRow<T>
          name={'agreeToTerms' as Path<T>}
          label='서비스 이용약관 동의'
          register={register}
          link={<TermsLink />}
        />
        <AgreementRow<T>
          name={'agreeToPrivacy' as Path<T>}
          label='개인정보 처리방침 동의'
          register={register}
          link={<TermsLink text='[개인정보 처리방침 보기]' />}
        />
        <AgreementRow<T>
          name={'agreeToMarketing' as Path<T>}
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
