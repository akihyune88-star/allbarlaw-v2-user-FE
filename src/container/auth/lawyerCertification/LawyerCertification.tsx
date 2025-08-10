import styles from './lawyerCertification.module.scss'
import LabelInput from '@/components/labelInput/LabelInput'
import { FieldErrors, UseFormRegister, Path, FieldValues } from 'react-hook-form'
import Divider from '@/components/divider/Divider'
import { getLawyerExamOptions } from '@/utils/auth'

export type LawyerCertificationProps<T extends FieldValues> = {
  register: UseFormRegister<T>
  errors: FieldErrors<T>
}

function LawyerCertification<
  T extends { lawyerName: string; lawyerContact: string; lawyerExam: string } & FieldValues
>({ register, errors }: LawyerCertificationProps<T>) {
  return (
    <section className={styles['lawyer-cert-section']}>
      <h2 className={styles['lawyer-cert-title']}>변호사 인증</h2>
      <Divider padding={1} />
      <div className={styles['lawyer-cert-fields']}>
        <LabelInput
          label='이름'
          placeholder='이름을 입력하세요'
          {...register('lawyerName' as Path<T>)}
          isError={!!errors.lawyerName}
          message={(errors.lawyerName as any)?.message}
        />
        <LabelInput
          label='연락처'
          placeholder='연락처를 입력하세요'
          {...register('lawyerContact' as Path<T>)}
          isError={!!errors.lawyerContact}
          message={(errors.lawyerContact as any)?.message}
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
