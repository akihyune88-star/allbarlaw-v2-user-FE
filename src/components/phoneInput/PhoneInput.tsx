import React, { useId } from 'react'
import styles from './phoneInput.module.scss'

type PhoneInputProps = {
  label: string
  isError?: boolean
  message?: string
  rightContent?: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>

const PhoneInput = ({ label, isError, message, rightContent, ...rest }: PhoneInputProps) => {
  const id = useId()

  return (
    <div className={styles['container']}>
      <div className={styles['field-container']}>
        <label htmlFor={id} className={styles['label']}>
          {label}
        </label>
        <div className={styles['input-container']}>
          <input id={id} className={styles['input']} aria-invalid={isError} {...rest} />
          {rightContent}
        </div>
      </div>
      <span className={styles['field-message']} data-error={isError}>
        {message || ''}
      </span>
    </div>
  )
}

export default PhoneInput
