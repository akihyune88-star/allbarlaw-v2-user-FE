import { ReactNode } from 'react'
import styles from '@/components/input/input.module.scss'
interface ConsultationInputProps {
  title: string
  headerChildren?: ReactNode
  placeholder?: string
}

const Input = ({ title, headerChildren, placeholder }: ConsultationInputProps) => {
  return (
    <div className={styles['input-wrapper']}>
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
