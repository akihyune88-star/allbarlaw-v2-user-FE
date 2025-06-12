import React from 'react'
import styles from './card.module.scss'

// 메인 컨테이너 컴포넌트
interface CardProps {
  children: React.ReactNode
  className?: string
  shadow?: boolean
  border?: boolean
  ring?: boolean
}

const Card = ({ children, className, shadow = true, border = true, ring = false }: CardProps) => {
  const cardClasses = [styles.card, shadow && styles.shadow, border && styles.border, ring && styles.ring, className]
    .filter(Boolean)
    .join(' ')

  return <div className={cardClasses}>{children}</div>
}

// 헤더 컴포넌트
interface HeaderProps {
  children: React.ReactNode
  className?: string
}

const Header = ({ children, className }: HeaderProps) => {
  return <div className={`${styles.header} ${className || ''}`}>{children}</div>
}

// 콘텐츠 컨테이너
interface ContentProps {
  children: React.ReactNode
  className?: string
}

const Content = ({ children, className }: ContentProps) => {
  return <div className={`${styles.content} ${className || ''}`}>{children}</div>
}

// 콘텐츠 컨테이너
interface FooterProps {
  children: React.ReactNode
  className?: string
}

const Footer = ({ children, className }: FooterProps) => {
  return <div className={`${styles.footer} ${className || ''}`}>{children}</div>
}

// 컴파운드 컴포넌트 구성
Card.Header = Header
Card.Content = Content
Card.Footer = Footer

export default Card
