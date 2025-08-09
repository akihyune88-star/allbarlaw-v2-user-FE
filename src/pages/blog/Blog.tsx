import styles from '@/pages/blog/bolg.module.scss'
import AIBlogCarousel from '@/container/blog/AIBlogCarousel'
import BlogList from '@/container/blog/BlogList'
import AIRecommender from '@/components/aiRecommender/AIRecommender'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import { formatKoreanWithHanja } from '@/utils/legalTermFormatter'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useInfiniteBlogList } from '@/hooks/queries/useGetBlogList'
import { useRecommendationLegalTerm } from '@/hooks/queries/useRecommendation'

const BlogLayout = () => {
  const navigate = useNavigate()
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const [sortCase, setSortCase] = useState<string>('all')

  const { blogList, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteBlogList({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    take: 4,
    orderBy: sortCase === 'all' ? 'createdAt' : (sortCase as 'createdAt' | 'viewCount' | 'likesCount'),
  })

  const blogIds = useMemo(() => blogList.map(b => b.blogCaseId), [blogList])

  const { data: recommendationLegalTerm } = useRecommendationLegalTerm({
    blogCaseIds: blogIds,
  })

  const legalTermNames = useMemo(() => formatKoreanWithHanja(recommendationLegalTerm ?? []), [recommendationLegalTerm])

  const handleSortCase = (key: string) => setSortCase(key)
  const handleBlogItemClick = (blogId: number) => navigate(`/${subcategoryId}/blog/${blogId}`)

  return (
    <main className={styles['blog-container']}>
      <section className={styles['blog-section']}>
        <AIBlogCarousel />
        <BlogList
          blogList={blogList}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          sortCase={sortCase}
          onChangeSort={handleSortCase}
          onClickItem={handleBlogItemClick}
        />
      </section>
      <aside className={styles['blog-aside']}>
        <section>
          <AIRecommender />
        </section>
        <section>
          <LegalTermWidget lagalTermList={legalTermNames} />
        </section>
      </aside>
    </main>
  )
}

export default BlogLayout
