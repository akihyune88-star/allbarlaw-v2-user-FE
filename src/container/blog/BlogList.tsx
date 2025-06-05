import styles from '@/container/blog/blog-list.module.scss'
import { useState } from 'react'
import BlogItem from '@/components/blogItem/BlogItem'
import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import { useParams } from 'react-router-dom'
import { useGetBlogList } from '@/hooks/queries/useGetBlogList'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const BlogList = () => {
  const [sortCase, setSortCase] = useState<string>('all')
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const { blogList } = useGetBlogList({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    take: 4,
  })

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
        {!isMobile && <Divider />}
        {blogList.map((blogItem, idx) => (
          <>
            <BlogItem key={blogItem.id} item={blogItem} className={styles['blog-list-item']} />
            {isMobile || (idx !== blogList.length - 1 && <Divider />)}
          </>
        ))}
      </section>
    </main>
  )
}

export default BlogList
