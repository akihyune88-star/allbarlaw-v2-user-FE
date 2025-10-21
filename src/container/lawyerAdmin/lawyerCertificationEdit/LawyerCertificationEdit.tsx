import styles from './lawyerCertificationEdit.module.scss'
import LabelInput from '@/components/labelInput/LabelInput'
import { FieldErrors, UseFormRegister, Path, FieldValues } from 'react-hook-form'
import Divider from '@/components/divider/Divider'
import { getLawyerExamOptions } from '@/utils/auth'
import { useState, ChangeEvent } from 'react'
import Button from '@/components/button/Button'

export type LawyerCertificationEditProps<T extends FieldValues> = {
  register: UseFormRegister<T>
  errors: FieldErrors<any>
  currentPhone?: string
  onPhoneVerification?: () => void
}

function LawyerCertificationEdit<T extends FieldValues>({
  register,
  errors,
  currentPhone,
  onPhoneVerification,
}: LawyerCertificationEditProps<T>) {
  const [firmContact, setFirmContact] = useState('')

  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '')

    // 최대 11자리로 제한
    const limitedNumbers = numbers.slice(0, 11)

    // 빈 문자열이면 그대로 반환
    if (!limitedNumbers) return ''

    // 서울 지역번호 02로 시작하는 경우
    if (limitedNumbers.startsWith('02')) {
      if (limitedNumbers.length <= 2) {
        return limitedNumbers
      } else if (limitedNumbers.length <= 6) {
        return `${limitedNumbers.slice(0, 2)}-${limitedNumbers.slice(2)}`
      } else if (limitedNumbers.length <= 9) {
        return `${limitedNumbers.slice(0, 2)}-${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`
      } else {
        return `${limitedNumbers.slice(0, 2)}-${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6, 10)}`
      }
    }

    // 그 외 (휴대폰 010, 지역번호 031 등)
    if (limitedNumbers.length <= 3) {
      return limitedNumbers
    } else if (limitedNumbers.length <= 7) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`
    } else if (limitedNumbers.length <= 10) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`
    } else {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7, 11)}`
    }
  }

  const handleFirmContactChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFirmContact(formatted)

    // react-hook-form에 값 전달 (하이픈 포함)
    const { onChange } = register('lawyerFirmContact' as Path<T>)
    onChange({
      target: {
        name: 'lawyerFirmContact',
        value: formatted,
      },
    } as any)
  }

  return (
    <section className={styles['lawyer-cert-section']}>
      <h2 className={styles['lawyer-cert-title']}>변호사 인증정보</h2>
      <Divider padding={1} />
      <div className={styles['lawyer-cert-fields']}>
        {/* 인증 휴대폰번호 (읽기 전용) */}
        <div className={styles['phone-display-container']}>
          <div className={styles['field-container']}>
            <label className={styles['label']}>인증 휴대폰번호</label>
            <div className={styles['text-value']}>{currentPhone || '-'}</div>
          </div>
          <span className={styles['field-message']}>휴대폰 번호를 변경하시려면 아래 휴대폰 인증을 다시해주세요</span>

          <Button type='button' onClick={onPhoneVerification} className={styles['verification-button']}>
            휴대폰 본인인증
          </Button>
        </div>

        <LabelInput
          label='소속(법인,회사)'
          placeholder='소속(법인,회사)을 입력하세요'
          {...register('lawyerFirm' as Path<T>)}
          isError={!!errors.lawyerFirm}
          message={(errors.lawyerFirm as any)?.message}
        />
        <LabelInput
          label='소속 연락처'
          placeholder='소속 연락처를 입력해주세요'
          {...register('lawyerFirmContact' as Path<T>)}
          value={firmContact}
          onChange={handleFirmContactChange}
          isError={!!errors.lawyerFirmContact}
          message={(errors.lawyerFirmContact as any)?.message}
          maxLength={13}
        />
        <LabelInput label='출신시험' isError={!!errors.lawyerExam} message={(errors.lawyerExam as any)?.message}>
          <select {...register('lawyerExam' as Path<T>)} className={styles['select']} defaultValue=''>
            {getLawyerExamOptions().map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </LabelInput>
      </div>
    </section>
  )
}

export default LawyerCertificationEdit
