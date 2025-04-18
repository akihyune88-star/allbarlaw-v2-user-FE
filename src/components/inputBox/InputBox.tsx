// InputBox.jsx
import React from 'react'
import styles from './inputBox.module.scss'

type InputBoxProps = {
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon?: React.ReactNode
  disabled?: boolean
  className?: string
}

const InputBox = ({
  type = 'text',
  placeholder = '',
  value = '',
  onChange = () => {},
  icon,
  disabled = false,
  className = '',
}: InputBoxProps) => {
  return (
    <div className={`${styles['input-container']} ${className}`}>
      <input
        type={type}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {icon}
    </div>
  )
}

export default InputBox
