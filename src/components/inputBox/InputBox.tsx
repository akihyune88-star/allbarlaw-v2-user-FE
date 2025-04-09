// InputBox.jsx
import React from 'react'
import SvgIcon from '../SvgIcon'
import styles from './inputBox.module.scss'

type InputBoxProps = {
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  iconType?: 'search' | 'send' | 'none'
  disabled?: boolean
  className?: string
}

const InputBox = ({
  type = 'text',
  placeholder = '',
  value = '',
  onChange = () => {},
  iconType = 'none',
  disabled = false,
  className = '',
}: InputBoxProps) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'search':
        return <SvgIcon name='search' className={styles.icon} />
      case 'send':
        return <SvgIcon name='send' className={styles.icon} />
      default:
        return null
    }
  }

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
      {renderIcon()}
    </div>
  )
}

export default InputBox
