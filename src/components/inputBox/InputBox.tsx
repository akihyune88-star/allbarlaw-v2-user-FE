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
  onIconClick?: () => void
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
  onIconClick,
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
      {icon && (
        <div className={styles.icon} onClick={onIconClick} style={{ cursor: onIconClick ? 'pointer' : 'default' }}>
          {icon}
        </div>
      )}
    </div>
  )
}

export default InputBox
