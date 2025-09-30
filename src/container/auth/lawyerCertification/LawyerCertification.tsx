import styles from './lawyerCertification.module.scss'
import LabelInput from '@/components/labelInput/LabelInput'
import { FieldErrors, UseFormRegister, Path, FieldValues } from 'react-hook-form'
import Divider from '@/components/divider/Divider'
import { getLawyerExamOptions } from '@/utils/auth'
import { useState, ChangeEvent } from 'react'

export type LawyerCertificationProps<T extends FieldValues> = {
  register: UseFormRegister<T>
  errors: FieldErrors<T>
}

function LawyerCertification<
  T extends { lawyerName: string; lawyerContact: string; lawyerExam: string } & FieldValues
>({ register, errors }: LawyerCertificationProps<T>) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [lawyerName, setLawyerName] = useState('')
  const [nameErrorMessage, setNameErrorMessage] = useState<string | undefined>(undefined)

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // 영문, 숫자, 특수문자가 포함되어 있는지 확인
    const hasNonKorean = /[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)

    if (hasNonKorean) {
      // 한글과 공백만 남기고 제거
      const filteredValue = value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ\s]/g, '')
      e.target.value = filteredValue
      setLawyerName(filteredValue)

      setNameErrorMessage('이름은 한글만 입력 가능합니다.')

      // 3초 후 에러 메시지 제거
      setTimeout(() => {
        setNameErrorMessage(undefined)
      }, 3000)

      // react-hook-form에 필터링된 값 전달
      const { onChange } = register('lawyerName' as Path<T>)
      onChange({
        target: {
          name: 'lawyerName',
          value: filteredValue,
        },
      } as any)
    } else {
      setNameErrorMessage(undefined)
      setLawyerName(value)

      // react-hook-form에 값 전달
      const { onChange } = register('lawyerName' as Path<T>)
      onChange({
        target: {
          name: 'lawyerName',
          value: value,
        },
      } as any)
    }
  }

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

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)

    // react-hook-form에 값 전달 (하이픈 포함)
    const { onChange } = register('lawyerContact' as Path<T>)
    onChange({
      target: {
        name: 'lawyerContact',
        value: formatted,
      },
    } as any)
  }
  return (
    <section className={styles['lawyer-cert-section']}>
      <h2 className={styles['lawyer-cert-title']}>변호사 인증</h2>
      <Divider padding={1} />
      <div className={styles['lawyer-cert-fields']}>
        <LabelInput
          label='이름'
          placeholder='이름을 입력하세요'
          {...register('lawyerName' as Path<T>)}
          value={lawyerName}
          onChange={handleNameChange}
          isError={!!errors.lawyerName || !!nameErrorMessage}
          message={(errors.lawyerName as any)?.message || nameErrorMessage}
        />
        <LabelInput
          label='연락처'
          placeholder='연락처를 입력해주세요'
          {...register('lawyerContact' as Path<T>)}
          value={phoneNumber}
          onChange={handlePhoneChange}
          isError={!!errors.lawyerContact}
          message={(errors.lawyerContact as any)?.message}
          maxLength={13}
        />
        <LabelInput
          label='소속(법인,회사)'
          placeholder='소속(법인,회사)을 입력하세요'
          {...register('lawyerFirm' as Path<T>)}
          isError={!!errors.lawyerFirm}
          message={(errors.lawyerFirm as any)?.message}
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

export default LawyerCertification
