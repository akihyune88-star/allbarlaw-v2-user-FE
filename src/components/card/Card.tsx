import React from 'react'
import styles from './card.module.scss'
import SvgIcon from '../SvgIcon'

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

// 제목 컴포넌트
interface TitleProps {
  children: React.ReactNode
  className?: string
}

const Title = ({ children, className }: TitleProps) => {
  return <h2 className={`${styles.title} ${className || ''}`}>{children}</h2>
}

// 메타 정보 컴포넌트 (시간 등)
interface MetaProps {
  children: React.ReactNode
  className?: string
}

const Meta = ({ children, className }: MetaProps) => {
  return <span className={`${styles.meta} ${className || ''}`}>{children}</span>
}

// 액션 버튼들 컨테이너
interface ActionsProps {
  children: React.ReactNode
  className?: string
}

const Actions = ({ children, className }: ActionsProps) => {
  return <div className={`${styles.actions} ${className || ''}`}>{children}</div>
}

// 공유 버튼
interface ShareButtonProps {
  onClick?: () => void
  className?: string
}

const ShareButton = ({ onClick, className }: ShareButtonProps) => {
  return (
    <button className={`${styles.actionButton} ${className || ''}`} onClick={onClick}>
      공유 <SvgIcon name='share' />
    </button>
  )
}

// 저장 버튼
interface SaveButtonProps {
  onClick?: () => void
  isSaved?: boolean
  className?: string
}

const SaveButton = ({ onClick, isSaved = false, className }: SaveButtonProps) => {
  return (
    <button className={`${styles.actionButton} ${isSaved ? styles.saved : ''} ${className || ''}`} onClick={onClick}>
      저장 <SvgIcon name={isSaved ? 'bookMarkStrong' : 'bookMark'} />
    </button>
  )
}

// 콘텐츠 컨테이너
interface ContentProps {
  children: React.ReactNode
  className?: string
}

const Content = ({ children, className }: ContentProps) => {
  return <div className={`${styles.content} ${className || ''}`}>{children}</div>
}

// 필드 컴포넌트 (라벨: 값 형태)
interface FieldProps {
  label: string
  value: string
  className?: string
  labelClassName?: string
  valueClassName?: string
}

const Field = ({ label, value, className, labelClassName, valueClassName }: FieldProps) => {
  return (
    <div className={`${styles.field} ${className || ''}`}>
      <span className={`${styles.fieldLabel} ${labelClassName || ''}`}>• {label} : </span>
      <span className={`${styles.fieldValue} ${valueClassName || ''}`}>{value}</span>
    </div>
  )
}

// 변호사 선택 컴포넌트
interface Lawyer {
  id: number
  name: string
  profileImage?: string
}

interface LawyerSelectionProps {
  lawyers: Lawyer[]
  className?: string
  labelClassName?: string
  valueClassName?: string
}

const LawyerSelection = ({ lawyers, className, labelClassName, valueClassName }: LawyerSelectionProps) => {
  return (
    <div className={`${styles.field} ${className || ''}`}>
      <span className={`${styles.fieldLabel} ${labelClassName || ''}`}>• 변호사 선택 : </span>
      <span className={`${styles.fieldValue} ${valueClassName || ''}`}>
        {lawyers.map((lawyer, index) => (
          <span key={lawyer.id}>
            {lawyer.name} 변호사
            {index < lawyers.length - 1 && ', '}
          </span>
        ))}
      </span>
    </div>
  )
}

// 컴파운드 컴포넌트 구성
Card.Header = Header
Card.Title = Title
Card.Meta = Meta
Card.Actions = Actions
Card.ShareButton = ShareButton
Card.SaveButton = SaveButton
Card.Content = Content
Card.Field = Field
Card.LawyerSelection = LawyerSelection

export default Card
