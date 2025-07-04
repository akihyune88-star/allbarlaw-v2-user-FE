import React, { useId } from 'react'
import styles from './labelInput.module.scss'

type LabelInputProps = {
  label: string
  isError?: boolean
  message?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const LabelInput = ({ label, isError, message, ...rest }: LabelInputProps) => {
  const id = useId()

  return (
    <div className={styles['container']}>
      <div className={styles['field-container']}>
        <label htmlFor={id} className={styles['label']}>
          {label}
        </label>
        <input id={id} className={styles['input']} aria-invalid={isError} {...rest} />
      </div>
      <span className={styles['field-message']} data-error={isError}>
        {message || '‎'}
      </span>
    </div>
  )
}

export default LabelInput
