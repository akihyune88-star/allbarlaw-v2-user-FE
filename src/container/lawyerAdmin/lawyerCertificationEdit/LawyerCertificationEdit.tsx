import styles from './lawyerCertificationEdit.module.scss'
import LabelInput from '@/components/labelInput/LabelInput'
import { FieldErrors, UseFormRegister, Path, FieldValues } from 'react-hook-form'
import Divider from '@/components/divider/Divider'
import { useState, ChangeEvent, useEffect, useMemo } from 'react'
import { useLawyerBarExam } from '@/hooks/queries/useLawyer'

export type LawyerCertificationEditProps<T extends FieldValues> = {
  register: UseFormRegister<T>
  errors: FieldErrors<any>
  currentFirmContact?: string
  currentBarExamType?: string
  currentBarExamNumber?: number
}

function LawyerCertificationEdit<T extends FieldValues>({
  register,
  errors,
  currentFirmContact,
  currentBarExamType,
  currentBarExamNumber,
}: LawyerCertificationEditProps<T>) {
  const [firmContact, setFirmContact] = useState('')
  const [selectedExamType, setSelectedExamType] = useState<string>(currentBarExamType || '')
  const [selectedExamNumber, setSelectedExamNumber] = useState<string>(currentBarExamNumber?.toString() || '')

  // 서버에서 시험 유형 데이터 가져오기
  const { data: examData, isLoading: isExamLoading } = useLawyerBarExam()

  // 선택된 시험 유형에 따른 기수 범위
  const examNumberOptions = useMemo(() => {
    if (!selectedExamType || !examData) return []

    const selectedExam = examData.find(exam => exam.type === selectedExamType)
    if (!selectedExam) return []

    const options = []
    for (let i = selectedExam.minNumber; i <= selectedExam.maxNumber; i++) {
      options.push({ value: String(i), label: `${i}회` })
    }
    return options
  }, [selectedExamType, examData])

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

  useEffect(() => {
    if (currentFirmContact) {
      const formatted = formatPhoneNumber(currentFirmContact)
      setFirmContact(formatted)
    }
  }, [currentFirmContact])

  // currentBarExamType이 변경되면 selectedExamType 업데이트
  useEffect(() => {
    setSelectedExamType(currentBarExamType || '')
  }, [currentBarExamType])

  // currentBarExamNumber가 변경되면 selectedExamNumber 업데이트
  useEffect(() => {
    setSelectedExamNumber(currentBarExamNumber?.toString() || '')
  }, [currentBarExamNumber])

  // 시험 유형이 변경되면 회차 초기화
  useEffect(() => {
    if (selectedExamType && selectedExamType !== currentBarExamType) {
      setSelectedExamNumber('')
      const { onChange } = register('lawyerBarExamNumber' as Path<T>)
      onChange({
        target: {
          name: 'lawyerBarExamNumber',
          value: '',
        },
      } as any)
    }
  }, [selectedExamType, currentBarExamType, register])

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
        <LabelInput
          label='출신시험 유형'
          isError={!!errors.lawyerBarExamType}
          message={(errors.lawyerBarExamType as any)?.message}
        >
          <select
            {...register('lawyerBarExamType' as Path<T>)}
            className={styles['select']}
            value={selectedExamType}
            disabled={isExamLoading}
            onChange={e => {
              setSelectedExamType(e.target.value)
              const { onChange } = register('lawyerBarExamType' as Path<T>)
              onChange(e)
            }}
          >
            <option value='' disabled>
              {isExamLoading ? '로딩 중...' : '시험 유형을 선택하세요'}
            </option>
            {examData?.map(exam => (
              <option key={exam.type} value={exam.type}>
                {exam.name}
              </option>
            ))}
          </select>
        </LabelInput>
        <LabelInput
          label='출신시험 회차'
          isError={!!errors.lawyerBarExamNumber}
          message={(errors.lawyerBarExamNumber as any)?.message}
        >
          <select
            {...register('lawyerBarExamNumber' as Path<T>)}
            className={styles['select']}
            value={selectedExamNumber}
            disabled={!selectedExamType}
            onChange={e => {
              setSelectedExamNumber(e.target.value)
              const { onChange } = register('lawyerBarExamNumber' as Path<T>)
              onChange(e)
            }}
          >
            <option value='' disabled>
              {!selectedExamType ? '시험 유형을 선택 후 회차를 선택해주세요' : '회차를 선택해주세요'}
            </option>
            {examNumberOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </LabelInput>
      </div>
    </section>
  )
}

export default LawyerCertificationEdit
