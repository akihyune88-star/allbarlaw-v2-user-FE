import styles from '@/container/blog/blog-list.module.scss'
import React from 'react'
import BlogItem from '@/components/blogItem/BlogItem'
import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { BlogCase } from '@/types/blogTypes'
import { useBlogCount } from '@/hooks/queries/useBlog'
import { useParams } from 'react-router-dom'

interface BlogListProps {
  blogList: BlogCase[]
  isLoading: boolean
  hasNextPage?: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  sortCase: string
  onChangeSort: (_key: string) => void
  onClickItem: (_blogId: number) => void
}

const BlogList = ({
  blogList,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  sortCase,
  onChangeSort,
  onClickItem,
}: BlogListProps) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const { subcategoryId } = useParams<{ subcategoryId: string }>()

  const { data: totalBlogCount } = useBlogCount({
    subcategoryId: subcategoryId ? Number(subcategoryId) : 'all',
    recentDays: 'all',
  })

  const { data: recentMonthCount } = useBlogCount({
    subcategoryId: subcategoryId ? Number(subcategoryId) : 'all',
    recentDays: 30,
  })

  // 무한스크롤 적용 (부모에서 전달된 페이징 제어 사용)
  useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  })

  return (
    <main className={styles['list-container']}>
      <ArticleHeader
        title={`변호사가 작성한 글 안에서\n 내 문제의 해결방법을 찾으세요.`}
        onClick={onChangeSort}
        activeKey={sortCase}
        totalBlogCount={totalBlogCount}
        recentBlogCount={recentMonthCount}
      />
      <section className={styles['blog-list']} aria-label='블로그 목록'>
        {!isMobile && <Divider />}
        {blogList.map((blogItem, idx) => (
          <React.Fragment key={blogItem.blogCaseId}>
            <BlogItem
              type='regular'
              item={blogItem}
              className={styles['blog-list-item']}
              onClick={() => onClickItem(blogItem.blogCaseId)}
            />
            {isMobile || (idx !== blogList.length - 1 && <Divider />)}
          </React.Fragment>
        ))}

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
