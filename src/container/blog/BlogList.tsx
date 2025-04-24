import styles from '@/container/blog/blog-list.module.scss'
import { exampleBlogData } from './constants'
import { useState } from 'react'
import BlogItem from '@/components/blogItem/BlogItem'
import ArticleHeader from '@/components/articleHeader/ArticleHeader'

const BlogList = () => {
  const [sortCase, setSortCase] = useState<string>('all')

  const handleSortCase = (key: string) => {
    setSortCase(key)
  }

  return (
    <main className={styles['list-container']}>
      <ArticleHeader
        title={`변호사가 작성한 글 안에서\n 내 문제의 해결방법을 찾으세요.`}
        onClick={handleSortCase}
        activeKey={sortCase}
        totalBlogCount={2147}
        recentBlogCount={4142}
      />
      <section className={styles['blog-list']} aria-label='블로그 목록'>
        {exampleBlogData.blogCases.map(_blogItem => (
          <BlogItem key={_blogItem.id} item={_blogItem} />
        ))}
      </section>
    </main>
  )
}

export default BlogList
