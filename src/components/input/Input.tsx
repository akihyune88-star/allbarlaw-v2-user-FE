import React, { ReactNode } from 'react'
import styles from '@/components/input/input.module.scss'

interface ConsultationInputProps {
  title: string
  headerChildren?: ReactNode
  footerChildren?: ReactNode
  placeholder?: string
  style?: React.CSSProperties
  textAreaStyle?: React.CSSProperties
  textAreaHeight?: string | number
  className?: string
  disabled?: boolean
  value?: string
  onChange?: (_e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const Input = ({
  title,
  headerChildren,
  footerChildren,
  placeholder,
  disabled,
  style,
  className,
  value,
  onChange,
  textAreaStyle,
  textAreaHeight,
}: ConsultationInputProps) => {
  const containerStyle: React.CSSProperties = {
    ...textAreaStyle,
    ...(textAreaHeight ? { height: textAreaHeight, flex: 'none' } : {}),
  }

  return (
    <div className={`${styles['input-wrapper']} ${className || ''}`} style={style}>
      <header className={styles['header']}>
        <h2 className={styles['title']}>{title}</h2>
        {headerChildren}
      </header>
      <div className={styles['input-container']} style={containerStyle}>
        <textarea placeholder={placeholder} value={value} onChange={onChange} disabled={disabled} />
      </div>
      {footerChildren && <footer className={styles['footer']}>{footerChildren}</footer>}
    </div>
  )
}

export default Input
