import React, { useId, useState } from 'react'
import styles from './labelInput.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { COLOR } from '@/styles/color'

type LabelInputProps = {
  label: string
  isError?: boolean
  message?: string
  children?: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>

const LabelInput = ({ label, isError, message, children, type, ...rest }: LabelInputProps) => {
  const id = useId()
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password'
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={styles['container']}>
      <div className={styles['field-container']}>
        <label htmlFor={id} className={styles['label']}>
          {label}
        </label>
        {children ? (
          children
        ) : (
          <div className={styles['input-wrapper']}>
            <input id={id} className={styles['input']} type={inputType} aria-invalid={isError} {...rest} />
            {isPasswordField && (
              <button
                type='button'
                className={styles['password-toggle']}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                <SvgIcon
                  name={showPassword ? 'eye' : 'eyeOff'}
                  size={20}
                  color={COLOR.icon_gray_50}
                />
              </button>
            )}
          </div>
        )}
      </div>
      <span className={styles['field-message']} data-error={isError}>
        {message || ''}
      </span>
    </div>
  )
}

export default LabelInput
