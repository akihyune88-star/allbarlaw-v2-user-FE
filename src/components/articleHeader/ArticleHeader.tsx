import { SORT_CASE } from '@/constants/category'
import styles from '@/components/articleHeader/article-header.module.scss'
import React from 'react'
import SvgIcon from '../SvgIcon'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useNavigate } from 'react-router-dom'

type SortItem = {
  key: string
  name: string
}

type ViewType = 'section' | 'total'

type ArticleHeaderProps = {
  onClick?: (key: string) => void
  navigationPath?: string
  activeKey?: string
  totalBlogCount: number
  recentBlogCount: number
  title: string
  button?: React.ReactNode
  type?: ViewType
  className?: string
}

const ArticleHeader = ({
  onClick,
  navigationPath,
  activeKey,
  totalBlogCount,
  recentBlogCount,
  title,
  className,
  button,
  type = 'section',
}: ArticleHeaderProps) => {
  const mainClassName = [styles[type], className].filter(Boolean).join(' ')
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const handleTotalViewClick = () => {
    if (navigationPath) {
      navigate(navigationPath)
    }
  }

  const renderSortCase = () => {
    if (isMobile) {
      return (
        <nav className={styles['nav-list']} aria-label='블로그 정렬'>
          <button
            onClick={() => onClick && onClick('전체')}
            className={`${styles.allButton} ${activeKey === '전체' ? styles.active : ''}`}
          >
            전체 {totalBlogCount.toLocaleString()}개
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
                onClick={() => onClick && onClick(item.key)}
                className={activeKey === item.key ? styles.active : ''}
              >
                {item.name === '전체' ? `${item.name} ${totalBlogCount.toLocaleString()}개` : item.name}
              </li>
            ))}
          </ul>
        </nav>
      )
    }
  }

  return (
    <header className={mainClassName}>
      <div className={styles['header']}>
        <h2>{title}</h2>
        {button && button}
        {type === 'section' && renderSortCase()}
        {type === 'total' && (
          <div className={styles['total-count']}>
            <p>
              전체 {totalBlogCount.toLocaleString()}개 / 최근 한달 {recentBlogCount.toLocaleString()}개
            </p>
            <button className={styles['total-view-button']}>
              <span>전체보기</span>
              <SvgIcon name='arrowSmall' size={16} style={{ transform: 'rotate(-90deg)' }} />
            </button>
          </div>
        )}
      </div>
      {type === 'total' && (
        <button className={styles['total-view-button']} onClick={handleTotalViewClick}>
          <span>전체보기</span>
          <SvgIcon name='arrowSmall' size={16} style={{ transform: 'rotate(-90deg)' }} />
        </button>
      )}
    </header>
  )
}

export default ArticleHeader
