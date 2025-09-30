import styles from '@/components/tag/tag.module.scss'
import React from 'react'

type TagProps = {
  tag: string
  onClick?: (e: React.MouseEvent) => void
  className?: string
}

const Tag = ({ tag, onClick, className }: TagProps) => {
  return (
    <span
      className={`${styles['tag']} ${className || ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {tag}
    </span>
  )
}

export default Tag
