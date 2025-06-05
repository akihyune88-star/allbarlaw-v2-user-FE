import { useBlogCount } from '@/hooks/queries/useBlogCount'
import styles from './blog-feed-container.module.scss'
import { useGetBlogList } from '@/hooks/queries/useGetBlogList'
import BlogItem from '@/components/blogItem/BlogItem'
import Article from '@/components/article/Article'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useNavigate } from 'react-router-dom'

const BlogFeedHeader = () => {
  const { data: totalBlogCount } = useBlogCount({
    subcategoryId: 'all',
    recentDays: 'all',
  })

  const { data: recentMonthCount } = useBlogCount({
    subcategoryId: 'all',
    recentDays: 30,
  })

  return (
    <header className={styles.header}>
      <h2 className={styles.title}>변호사의 글</h2>
      <div className={styles.count}>
        <span className={styles['count-number']}>전체 {totalBlogCount?.toLocaleString()}개 / </span>
        <span className={styles['count-number']}>최근 한달 {recentMonthCount?.toLocaleString()}개</span>
      </div>
    </header>
  )
}

const BlogFeedContainer = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const navigate = useNavigate()

  const { blogList } = useGetBlogList({
    subcategoryId: 'all',
    take: 4,
    orderBy: 'createdAt',
  })

  const subBlogList = isMobile ? blogList : blogList.slice(1, 4)

  const handleBlogClick = (subcategoryId: number, blogId: number) => {
    navigate(`/${subcategoryId}/blog/${blogId}`)
  }

  return (
    <section className={styles.container}>
      <BlogFeedHeader />
      <div className={styles['blog-list-container']}>
        <div className={`${styles['main-blog-item']} ${isMobile ? styles.hidden : ''}`}>
          {blogList[0] && (
            <Article
              type='xxlarge'
              thumbnailUrl={blogList[0].thumbnail}
              title={blogList[0].title}
              content={blogList[0].summaryContent}
              lawyerInfo={{ name: blogList[0].lawyerName, profileImageUrl: blogList[0].lawyerProfileImage }}
              onClick={() => handleBlogClick(blogList[0].subcategoryId, blogList[0].blogCaseId)}
            />
          )}
        </div>
        <div className={styles['sub-blog-list']}>
          {subBlogList.map((blog, idx) => (
            <>
              <BlogItem
                key={blog.blogCaseId}
                item={blog}
                className={styles['sub-blog-list-item']}
                onClick={() => handleBlogClick(blog.subcategoryId, blog.blogCaseId)}
              />
              {isMobile || (idx !== subBlogList.length - 1 && <Divider padding={29} />)}
            </>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogFeedContainer
