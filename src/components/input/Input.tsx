import React, { ReactNode } from 'react'
import styles from '@/components/input/input.module.scss'

interface ConsultationInputProps {
  title: string
  headerChildren?: ReactNode
  footerChildren?: ReactNode
  placeholder?: string
  style?: React.CSSProperties
  textAreaStyle?: React.CSSProperties
  className?: string
  value?: string
  onChange?: (_e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const Input = ({
  title,
  headerChildren,
  footerChildren,
  placeholder,
  style,
  className,
  value,
  onChange,
  textAreaStyle,
}: ConsultationInputProps) => {
  return (
    <div className={`${styles['input-wrapper']} ${className || ''}`} style={style}>
      <header className={styles['header']}>
        <h2 className={styles['title']}>{title}</h2>
        {headerChildren}
      </header>
      <div className={styles['input-container']} style={textAreaStyle}>
        <textarea placeholder={placeholder} value={value} onChange={onChange} />
      </div>
      {footerChildren && <footer className={styles['footer']}>{footerChildren}</footer>}
    </div>
  )
}

export default Input
