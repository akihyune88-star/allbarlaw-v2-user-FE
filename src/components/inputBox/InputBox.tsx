// InputBox.jsx
import React from 'react'
import styles from './inputBox.module.scss'

type InputBoxProps = {
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  icon?: React.ReactNode
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

const InputBox = ({
  type = 'text',
  placeholder = '',
  value = '',
  onChange = () => {},
  onKeyDown,
  icon,
  disabled = false,
  className = '',
  style,
}: InputBoxProps) => {
  return (
    <div className={`${styles['input-container']} ${className}`} style={style}>
      <input
        type={type}
        className={`${styles.input} ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        style={style}
      />
      {icon}
    </div>
  )
}

export default InputBox
