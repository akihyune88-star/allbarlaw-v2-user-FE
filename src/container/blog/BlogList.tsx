import styles from '@/container/blog/blog-list.module.scss'
import { useState } from 'react'
import BlogItem from '@/components/blogItem/BlogItem'
import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import { useNavigate, useParams } from 'react-router-dom'
import { useInfiniteBlogList } from '@/hooks/queries/useGetBlogList'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const BlogList = () => {
  const navigate = useNavigate()
  const [sortCase, setSortCase] = useState<string>('all')
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const { blogList, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteBlogList({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    take: 4,
    orderBy: sortCase === 'all' ? 'createdAt' : (sortCase as 'createdAt' | 'viewCount' | 'likesCount'),
  })

  // 무한스크롤 적용
  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  const handleSortCase = (key: string) => {
    setSortCase(key)
    // useInfiniteQuery는 쿼리 키가 바뀌면 자동으로 초기화됨
  }

  const handleBlogItemClick = (blogId: number) => navigate(`/${subcategoryId}/blog/${blogId}`)

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
            <BlogItem
              key={blogItem.blogCaseId}
              type="regular"
              item={blogItem}
              className={styles['blog-list-item']}
              onClick={() => handleBlogItemClick(blogItem.blogCaseId)}
            />
            {isMobile || (idx !== blogList.length - 1 && <Divider />)}
          </>
        ))}

        {/* 로딩 인디케이터 */}
        {(isLoading || isFetchingNextPage) && (
          <div className={styles['loading-container']}>
            <div className={styles['loading-text']}>로딩 중...</div>
          </div>
        )}
      </section>
    </main>
  )
}

export default BlogList
