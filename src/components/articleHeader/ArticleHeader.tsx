import { SORT_CASE } from '@/constants/category'
import styles from '@/components/articleHeader/article-header.module.scss'
import React from 'react'

type SortItem = {
  key: string
  name: string
}

type ViewType = 'list' | 'default'

type BlogHeaderProps = {
  onClick: (key: string) => void
  activeKey: string
  totalBlogCount: number
  recentBlogCount: number
  title: string
  mobileTitle: string
  button?: React.ReactNode
  type?: ViewType
}

const ArticleHeader = ({
  onClick,
  activeKey,
  totalBlogCount,
  recentBlogCount,
  title,
  mobileTitle,
  button,
  type = 'default',
}: BlogHeaderProps) => {
  const renderSortedContentsMobileView = (type: ViewType) => {
    if (type === 'list') {
      return (
        <p>
          전체 {totalBlogCount.toLocaleString()}개 / 최근 한달 ${recentBlogCount.toLocaleString()}개`
        </p>
      )
    } else {
      return (
        <nav className={styles['nav-list']} aria-label='블로그 정렬'>
          <button
            onClick={() => onClick('전체')}
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
                  onClick={() => onClick(item.key)}
                  className={activeKey === item.key ? styles.active : ''}
                >
                  {item.name}
                </li>
              )
            })}
          </ul>
        </nav>
      )
    }
  }

  return (
    <header>
      <div className={styles['header']}>
        <h2>{title}</h2>
        {button && button}
        <nav className={styles['nav-list']} aria-label='블로그 정렬'>
          <ul className={styles['sort-case']}>
            {SORT_CASE.map((item: SortItem) => (
              <li
                key={item.key}
                onClick={() => onClick(item.key)}
                className={activeKey === item.key ? styles.active : ''}
              >
                {item.name === '전체' ? `${item.name} ${totalBlogCount.toLocaleString()}개` : item.name}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={styles['header-mobile']}>
        <h2>{mobileTitle}</h2>
        {button && button}
        <div className={styles['mobile-bottom']}>{renderSortedContentsMobileView(type)}</div>
      </div>
    </header>
  )
}

export default ArticleHeader
