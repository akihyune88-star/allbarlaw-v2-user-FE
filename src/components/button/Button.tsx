// Button.tsx
import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from '@/components/button/button.module.scss'

// 버튼 변형 타입 정의
type ButtonVariant = 'primary' | 'secondary' | 'fill' | 'share' | 'save' | 'normal'

// 버튼 크기 타입 정의
type ButtonSize = 'small' | 'medium' | 'large'

// 버튼 Props 인터페이스
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  rounded?: boolean
  disabled?: boolean
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  rounded = false,
  disabled = false,
  onClick,
  className = '',
  ...rest
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    rounded ? styles.rounded : '',
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={buttonClasses} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  )
}

export default Button
