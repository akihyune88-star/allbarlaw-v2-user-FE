import React from 'react'
import SvgIcon from '@/components/SvgIcon'
import styles from './empty-state.module.scss'

interface EmptyStateProps {
  message: string
  iconName?: string
  iconStyle?: React.CSSProperties
}

const EmptyState = ({ message, iconName = 'search', iconStyle }: EmptyStateProps) => {
  return (
    <div className={styles['empty-state']}>
      <SvgIcon name={iconName} style={{ width: 24, height: 24, ...iconStyle }} />
      <p className={styles['empty-text']}>{message}</p>
    </div>
  )
}

export default EmptyState