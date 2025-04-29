import { SORT_CASE } from '@/constants/category'
import styles from '@/components/articleHeader/article-header.module.scss'
import React from 'react'

type SortItem = {
  key: string
  name: string
}

type BlogHeaderProps = {
  onClick: (key: string) => void
  activeKey: string
  totalBlogCount: number
  recentBlogCount: number
  title: string
  mobileTitle: string
  button?: React.ReactNode
}

const ArticleHeader = ({
  onClick,
  activeKey,
  totalBlogCount,
  recentBlogCount,
  title,
  mobileTitle,
  button,
}: BlogHeaderProps) => {
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
        <p>
          전체 {totalBlogCount.toLocaleString()}개 / 최근 한달 {recentBlogCount.toLocaleString()}개
        </p>
      </div>
    </header>
  )
}

export default ArticleHeader
