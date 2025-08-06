import { SORT_CASE } from '@/constants/category'
import styles from '@/components/articleHeader/article-header.module.scss'
import React, { useEffect, useRef } from 'react'
import SvgIcon from '../SvgIcon'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { SortType } from '@/types/sortTypes'

type SortItem = {
  key: SortType
  name: string
}

type ViewType = 'section' | 'total'

type ArticleHeaderProps = {
  onClick?: (_key: SortType) => void
  onClickTotalView?: () => void
  activeKey?: string
  totalBlogCount?: number
  recentBlogCount?: number
  title: string
  button?: React.ReactNode
  type?: ViewType
  className?: string
  titleType?: 'horizontal' | 'vertical'
}

const ArticleHeader = ({
  title,
  button,
  type = 'section',
  className,
  titleType = 'vertical',
  onClick,
  onClickTotalView,
  activeKey,
  totalBlogCount,
  recentBlogCount,
}: ArticleHeaderProps) => {
  const mainClassName = [styles[type], className].filter(Boolean).join(' ')
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.setProperty('--header-flex-direction', titleType === 'horizontal' ? 'row' : 'column')
      headerRef.current.style.setProperty('--header-aline-content', titleType === 'horizontal' ? 'flex-end' : 'center')
    }
  }, [titleType])

  const handleSortCase = (key: SortType) => {
    if (key === 'all') return
    else {
      onClick && onClick(key)
    }
  }

  const renderSortCase = () => {
    if (isMobile) {
      return (
        <nav className={styles['nav-list']} aria-label='블로그 정렬'>
          <button className={`${styles.allButton} ${activeKey === '전체' ? styles.active : ''}`}>
            전체 {totalBlogCount?.toLocaleString()}개
          </button>
          <ul className={styles['sort-case']}>
            {SORT_CASE.map((item: SortItem) => {
              if (item.name === '전체') {
                return null
              }
              return (
                <li
                  key={item.key}
                  onClick={() => onClick && onClick(item.key)}
                  className={activeKey === item.key ? styles.active : ''}
                >
                  {item.name}
                </li>
              )
            })}
          </ul>
        </nav>
      )
    } else {
      return (
        <nav className={styles['nav-list']} aria-label='블로그 정렬'>
          <ul className={styles['sort-case']}>
            {SORT_CASE.map((item: SortItem) => (
              <li
                key={item.key}
                onClick={() => handleSortCase(item.key)}
                className={activeKey === item.key ? styles.active : ''}
              >
                {item.name === '전체' ? `${item.name} ${totalBlogCount?.toLocaleString()}개` : item.name}
              </li>
            ))}
          </ul>
        </nav>
      )
    }
  }

  return (
    <header className={mainClassName} ref={headerRef}>
      <div className={styles['header']}>
        <h2>{title}</h2>
        {button && button}
        {type === 'section' && renderSortCase()}
        {type === 'total' && (
          <div className={styles['total-count']}>
            <p>
              전체 {totalBlogCount?.toLocaleString()}개 / 최근 한달 {recentBlogCount?.toLocaleString()}개
            </p>
            <button className='total-view-button' onClick={onClickTotalView}>
              <span>전체보기</span>
              <SvgIcon name='arrowSmall' size={16} style={{ transform: 'rotate(-90deg)' }} />
            </button>
          </div>
        )}
      </div>
      {type === 'total' && (
        <button
          className={`total-view-button ${styles['total-mobile-button']}`}
          style={{ transform: 'translateY(3px)' }}
          onClick={onClickTotalView}
        >
          <span>전체보기</span>
          <SvgIcon name='arrowSmall' size={16} style={{ transform: 'rotate(-90deg)' }} />
        </button>
      )}
    </header>
  )
}

export default ArticleHeader
