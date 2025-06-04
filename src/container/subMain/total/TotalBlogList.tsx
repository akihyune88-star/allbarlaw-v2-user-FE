import Article from '@/components/article/Article'
import ArticleHeader from '@/components/articleHeader/ArticleHeader'
import styles from '@/container/subMain/total/total-blog-list.module.scss'
import { useBlogCount } from '@/hooks/queries/useBlogCount'
import { useGetBlogList } from '@/hooks/queries/useGetBlogList'
import { useCategoryInfo } from '@/hooks/useCategoryInfo'
import { ROUTER } from '@/routes/routerConstant'
import { useNavigate, useParams } from 'react-router-dom'

const TotalBlogList = () => {
  const { subcategoryId } = useParams<{ subcategoryId: string }>()
  const navigate = useNavigate()

  const categoryInfo = useCategoryInfo(subcategoryId)

  const { data: blogMonthCount } = useBlogCount({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    recentDays: 30,
  })

  const { data: blogTotalCount } = useBlogCount({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    recentDays: 'all',
  })

  const { blogList } = useGetBlogList({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    take: 4,
  })

  const handleTotalBlogClick = () => {
    navigate(`/${subcategoryId}${ROUTER.BLOG}`)
  }

  return (
    <div className={styles['total-blog-list']}>
      <ArticleHeader
        title='변호사의 글'
        totalBlogCount={blogTotalCount}
        recentBlogCount={blogMonthCount}
        type='total'
        onClickTotalView={handleTotalBlogClick}
      />
      <div className={styles['blog-list']}>
        {blogList.map(blogItem => (
          <Article
            key={blogItem.id}
            type='xsmall'
            thumbnailUrl={blogItem.thumbnail}
            title={blogItem.title}
            content={blogItem.summaryContent}
            category={categoryInfo?.subcategory.subcategoryName || ''}
            lawyerInfo={{
              name: blogItem.lawyerName,
              profileImageUrl: blogItem.lawyerProfileImage,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default TotalBlogList
