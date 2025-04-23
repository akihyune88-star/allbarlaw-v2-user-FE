import React, { ReactNode } from 'react'
import styles from '@/components/input/input.module.scss'

interface ConsultationInputProps {
  title: string
  headerChildren?: ReactNode
  placeholder?: string
  style?: React.CSSProperties
  className?: string
}

const Input = ({ title, headerChildren, placeholder, style, className }: ConsultationInputProps) => {
  return (
    <div className={`${styles['input-wrapper']} ${className || ''}`} style={style}>
      <header className={styles['header']}>
        <h2 className={styles['title']}>{title}</h2>
        {headerChildren}
      </header>
      <div className={styles['input-container']}>
        <textarea placeholder={placeholder} />
      </div>
    </div>
  )
}

export default Input
