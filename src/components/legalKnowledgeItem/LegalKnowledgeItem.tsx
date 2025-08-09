import SvgIcon from '../SvgIcon'
import styles from '@/components/legalKnowledgeItem/legal-knowledge-item.module.scss'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { COLOR } from '@/styles/color'
import { formatTimeAgo } from '@/utils/date'
import { useAuth } from '@/contexts/AuthContext'
import { useKnowledgeKeep } from '@/hooks/queries/useGetKnowledgeList'
import React, { useEffect, useState, useRef } from 'react'

type LegalKnowledgeItemProps = {
  knowledgeId: number
  title: string
  description: string
  time?: Date
  isLastAnswer?: boolean
  lawyerList?: {
    lawyerId: number
    lawyerProfileImage: string
    lawyerName: string
  }[]
  onClick?: () => void
  knowledgeKeep?: boolean
  isShowKeep?: boolean
  className?: string
}

const LegalKnowledgeItem = ({
  knowledgeId,
  title,
  description,
  time,
  isLastAnswer,
  lawyerList,
  onClick,
  knowledgeKeep,
  isShowKeep = true,
  className,
}: LegalKnowledgeItemProps) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const { isLoggedIn } = useAuth()
  const formattedTime = time ? formatTimeAgo(time) : ''
  console.log(time)

  const [isKeep, setIsKeep] = useState(knowledgeKeep)
  const lawyerListRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    setIsKeep(knowledgeKeep)
  }, [knowledgeKeep])

  const { mutate: changeKnowledgeKeep } = useKnowledgeKeep({
    onSuccess: data => {
      setIsKeep(data.isKeep)
    },
    onError: () => {
      console.error('Failed to change knowledge keep')
      setIsKeep(prevState => !prevState)
    },
  })

  const handleKnowledgeKeep = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLoggedIn && knowledgeId) {
      setIsKeep(prevState => !prevState)
      changeKnowledgeKeep(knowledgeId)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!lawyerListRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - lawyerListRef.current.offsetLeft)
    setScrollLeft(lawyerListRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !lawyerListRef.current) return
    e.preventDefault()
    const x = e.pageX - lawyerListRef.current.offsetLeft
    const walk = (x - startX) * 2
    lawyerListRef.current.scrollLeft = scrollLeft - walk
  }

  return (
    <article
      className={`${styles['legal-knowledge-item']} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <header className={styles['header']}>
        <h1>{title}</h1>
        {time && (
          <div className={styles['header-right']}>
            <span>
              <span className={styles['time']}>{formattedTime}</span> {isLastAnswer && '마지막 답변'}
            </span>
            {isLoggedIn && isShowKeep && (
              <button className={styles['bookmark-icon']} onClick={handleKnowledgeKeep}>
                <SvgIcon name='bookMark' fill={isKeep ? COLOR.green_01 : 'none'} />
              </button>
            )}
          </div>
        )}
      </header>
      <div className={styles['description-wrapper']}>
        <p className={styles['description']}>{description}</p>
      </div>
      {lawyerList && (
        <footer className={styles['footer']}>
          <div className={styles['footer-title']}>
            의뢰인이 선택한 변호사
            <SvgIcon
              name='checkRound'
              stroke={isMobile ? COLOR.green_01 : COLOR.icon_darkgreen}
              fill={COLOR.white}
              style={{ transform: 'translateY(-1px)' }}
            />
          </div>
          <div
            ref={lawyerListRef}
            className={`${styles['lawyer-list']} ${isDragging ? styles['dragging'] : ''}`}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {lawyerList.map(lawyer => (
              <div className={styles['lawyer-item']} key={lawyer.lawyerId}>
                <img src={lawyer.lawyerProfileImage} alt={lawyer.lawyerName} />
                <span>{lawyer.lawyerName} 변호사</span>
              </div>
            ))}
          </div>
        </footer>
      )}

      {isMobile && (
        <div className={styles['header-right']}>
          <span>
            <span className={styles['time']}>{formattedTime}</span> {isLastAnswer && '마지막 답변'}
          </span>
          {isLoggedIn && isShowKeep && (
            <button className={styles['bookmark-icon']} onClick={handleKnowledgeKeep}>
              <SvgIcon name='bookMark' fill={isKeep ? COLOR.green_01 : 'none'} />
            </button>
          )}
        </div>
      )}
    </article>
  )
}

export default LegalKnowledgeItem
