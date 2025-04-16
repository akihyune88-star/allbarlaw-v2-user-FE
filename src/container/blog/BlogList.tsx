import styles from '@/container/blog/blog-list.module.scss'
import { exampleBlogData, SORT_CASE } from './constants'
import { useState } from 'react'
import { BlogCase } from '@/types/blogTypes'

type SortItem = {
  key: string
  name: string
}

type BlogHeaderProps = {
  onClick: (key: string) => void
  activeKey: string
  totalBlogCount: number
  recentBlogCount: number
}

const BlogHeader = ({ onClick, activeKey, totalBlogCount, recentBlogCount }: BlogHeaderProps) => {
  return (
    <>
      <div className={styles['blog-header']}>
        <h2>{`변호사가 작성한 글 안에서\n 내 문제의 해결방법을 찾으세요.`}</h2>
        <nav className={styles['nav-list']}>
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
      <div className={styles['blog-header-mobile']}>
        <h2>최신 블로그글</h2>
        <p>
          전체 {totalBlogCount.toLocaleString()}개 / 최근 한달 {recentBlogCount.toLocaleString()}개
        </p>
      </div>
    </>
  )
}

const BlogItem = ({ item }: { item: BlogCase }) => {
  return (
    <div className={styles['blog-item']}>
      <div className={styles['blog-content']}>
        <h3>{item.title}</h3>
        <p>{item.summaryContents}</p>
        <span>
          {item.lawyer} 변호사 [{item.lawfirm}]
        </span>
      </div>
      <div>
        <img
          className={styles['blog-item-img']}
          src='https://www.monthlypeople.com/news/photo/202003/21217_12862_5312.png'
          alt='blog-item-image'
        />
      </div>
    </div>
  )
}

const BlogList = () => {
  const [sortCase, setSortCase] = useState<string>('all')

  const handleSortCase = (key: string) => {
    setSortCase(key)
  }

  return (
    <div className={styles['list-container']}>
      <BlogHeader onClick={handleSortCase} activeKey={sortCase} totalBlogCount={2147} recentBlogCount={4142} />
      <div className={styles['blog-list']}>
        {exampleBlogData.blogCases.map(_blogItem => (
          <BlogItem item={_blogItem} />
        ))}
      </div>
    </div>
  )
}

export default BlogList
