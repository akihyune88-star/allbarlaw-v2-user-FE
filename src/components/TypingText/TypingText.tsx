import React, { useEffect, useState } from 'react'
import styles from './TypingText.module.scss'

interface TypingTextProps {
  text: string
  isActive: boolean // 현재 단계가 활성화되었는지
  speed?: number // 타이핑 속도 (ms)
  className?: string
  showCursor?: boolean // 커서 표시 여부
  children?: (_displayText: string, _showCursor: boolean) => React.ReactNode // render prop
}

export const TypingText = ({
  text,
  isActive,
  speed = 100,
  className,
  showCursor = true,
  children,
}: TypingTextProps) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setDisplayText('')
      setCurrentIndex(0)
      setIsTyping(false)
      return
    }

    setIsTyping(true)

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    }
    // 타이핑 완료
    setIsTyping(false)
    return undefined
  }, [isActive, currentIndex, text, speed])

  const shouldShowCursor = showCursor && isTyping

  if (children) {
    return <>{children(displayText, shouldShowCursor)}</>
  }

  return (
    <span className={className}>
      {displayText}
      {shouldShowCursor && <span className={styles.cursor}>|</span>}
    </span>
  )
}
