import styles from '@/container/blog/blog-list.module.scss'
import { useState, useEffect, useRef } from 'react'
import BlogItem from '@/components/blogItem/BlogItem'
import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import { useNavigate, useParams } from 'react-router-dom'
import { useInfiniteBlogList } from '@/hooks/queries/useGetBlogList'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const BlogList = () => {
  const navigate = useNavigate()
  const [sortCase, setSortCase] = useState<string>('all')
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const throttleRef = useRef<number | null>(null)

  const { blogList, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteBlogList({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    take: 4,
    orderBy: sortCase === 'all' ? 'createdAt' : (sortCase as 'createdAt' | 'viewCount' | 'likesCount'),
  })

  // 최신 상태를 참조하기 위한 ref
  const isFetchingRef = useRef(isFetchingNextPage)
  const hasNextPageRef = useRef(hasNextPage)
  const fetchNextPageRef = useRef(fetchNextPage)

  // ref 업데이트
  useEffect(() => {
    isFetchingRef.current = isFetchingNextPage
    hasNextPageRef.current = hasNextPage
    fetchNextPageRef.current = fetchNextPage
  }, [isFetchingNextPage, hasNextPage, fetchNextPage])

  const handleSortCase = (key: string) => {
    setSortCase(key)
    // useInfiniteQuery는 쿼리 키가 바뀌면 자동으로 초기화됨
  }

  const handleBlogItemClick = (blogId: number) => navigate(`/${subcategoryId}/blog/${blogId}`)

  // 무한 스크롤 구현 (throttled)
  useEffect(() => {
    const handleScroll = () => {
      // 이미 스크롤 이벤트가 처리 중이면 무시
      if (throttleRef.current) return

      // throttle 적용 (200ms)
      throttleRef.current = window.setTimeout(() => {
        throttleRef.current = null

        // 스크롤이 바닥에서 200px 이내에 있고, 현재 로딩 중이 아닐 때만 다음 페이지 로드
        if (
          window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200 &&
          !isFetchingRef.current &&
          hasNextPageRef.current
        ) {
          console.log('Fetching next page...')
          fetchNextPageRef.current()
        }
      }, 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (throttleRef.current) {
        window.clearTimeout(throttleRef.current)
      }
    }
  }, []) // 의존성 배열 비움 - 한 번만 등록

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
