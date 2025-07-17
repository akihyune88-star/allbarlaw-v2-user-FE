import React, { createContext, useContext, ReactNode } from 'react'
import { useAccordion } from '@/hooks/useAccordion'
import styles from './accordion.module.scss'
import SvgIcon from '../SvgIcon'

interface AccordionContextType {
  openItems: Set<string | number>
  toggleItem: (itemId: string | number) => void
  isOpen: (itemId: string | number) => boolean
  allowMultiple: boolean
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined)

const useAccordionContext = () => {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion 컴포넌트 내부에서만 사용할 수 있습니다.')
  }
  return context
}

export interface AccordionProps {
  children: ReactNode
  allowMultiple?: boolean
  defaultOpen?: string | number | (string | number)[]
  className?: string
}

export interface AccordionItemProps {
  children: ReactNode
  id: string | number
  className?: string
}

export interface AccordionTitleProps {
  children: ReactNode
  itemId: string | number
  className?: string
}

export interface AccordionContentProps {
  children: ReactNode
  itemId: string | number
  className?: string
}

const AccordionItem: React.FC<AccordionItemProps> = ({ children, id, className = '' }) => {
  return <div className={`${styles.accordionItem} ${className}`}>{children}</div>
}

const AccordionTitle: React.FC<AccordionTitleProps> = ({ children, itemId, className = '' }) => {
  const { isOpen, toggleItem } = useAccordionContext()

  return (
    <button
      className={`${styles.accordionHeader} ${className}`}
      onClick={() => toggleItem(itemId)}
      aria-expanded={isOpen(itemId)}
    >
      {children}
      <div className={styles.arrowIconWrapper}>
        <SvgIcon
          name='arrowSmall'
          className={`${styles.arrowIcon} ${isOpen(itemId) ? styles.rotated : ''}`}
          size={16}
        />
      </div>
    </button>
  )
}

const AccordionContent: React.FC<AccordionContentProps> = ({ children, itemId, className = '' }) => {
  const { isOpen } = useAccordionContext()

  return (
    <div
      className={`${styles.accordionContent} ${isOpen(itemId) ? styles.open : ''} ${className}`}
      aria-hidden={!isOpen(itemId)}
    >
      <div className={styles.contentWrapper}>
        {typeof children === 'string' ? <p className={styles.contentText}>{children}</p> : children}
      </div>
    </div>
  )
}

const AccordionComponent: React.FC<AccordionProps> = ({
  children,
  allowMultiple = false,
  defaultOpen = [],
  className = '',
}) => {
  const accordionState = useAccordion(allowMultiple, defaultOpen)

  return (
    <AccordionContext.Provider value={accordionState}>
      <div className={`${styles.accordion} ${className}`}>{children}</div>
    </AccordionContext.Provider>
  )
}

// 네임스페이스 패턴으로 하위 컴포넌트들을 Accordion에 추가
const Accordion = Object.assign(AccordionComponent, {
  Item: AccordionItem,
  Title: AccordionTitle,
  Content: AccordionContent,
})

export default Accordion
