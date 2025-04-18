import styles from '@/container/blog/blog-list.module.scss'
import { exampleBlogData, SORT_CASE } from './constants'
import { useState } from 'react'
import { BlogCase } from '@/types/blogTypes'
import { useNavigate, useParams } from 'react-router-dom'
import { getBlogSummaryText } from '@/utils/blogTextFormatter'

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
    <header>
      <div className={styles['blog-header']}>
        <h2>{`변호사가 작성한 글 안에서\n 내 문제의 해결방법을 찾으세요.`}</h2>
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
      <div className={styles['blog-header-mobile']}>
        <h2>최신 블로그글</h2>
        <p>
          전체 {totalBlogCount.toLocaleString()}개 / 최근 한달 {recentBlogCount.toLocaleString()}개
        </p>
      </div>
    </header>
  )
}

const BlogItem = ({ item }: { item: BlogCase }) => {
  const navigate = useNavigate()
  const { categoryId } = useParams()

  const summaryContents = getBlogSummaryText(item.summaryContents)

  const handleClick = () => {
    const path = categoryId ? `/${categoryId}/blog/${item.id}` : `/blog/${item.id}`

    navigate(path, {
      state: { blogItem: item },
    })
  }

  return (
    <article className={styles['blog-item']} onClick={handleClick}>
      <div className={styles['blog-content']}>
        <h3>{item.title}</h3>
        <p>{summaryContents}</p>
        <span className={styles.lawyer}>{item.lawyer} 변호사</span>{' '}
        <span className={styles.lawfirm}>[{item.lawfirm}]</span>
        <div className={styles['blog-item-tag']}>
          <button>재산범죄</button>
          <button>형사기타</button>
          <button>사기</button>
        </div>
      </div>
      <figure>
        <img
          className={styles['blog-item-img']}
          src='https://www.monthlypeople.com/news/photo/202003/21217_12862_5312.png'
          alt='blog-item-image'
        />
      </figure>
    </article>
  )
}

const BlogList = () => {
  const [sortCase, setSortCase] = useState<string>('all')

  const handleSortCase = (key: string) => {
    setSortCase(key)
  }

  return (
    <main className={styles['list-container']}>
      <BlogHeader onClick={handleSortCase} activeKey={sortCase} totalBlogCount={2147} recentBlogCount={4142} />
      <section className={styles['blog-list']} aria-label='블로그 목록'>
        {exampleBlogData.blogCases.map(_blogItem => (
          <BlogItem key={_blogItem.id} item={_blogItem} />
        ))}
      </section>
    </main>
  )
}

export default BlogList
