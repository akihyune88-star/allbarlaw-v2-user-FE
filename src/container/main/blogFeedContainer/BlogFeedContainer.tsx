import React from 'react'
import { useBlogCount } from '@/hooks/queries/useBlogCount'
import styles from './blog-feed-container.module.scss'
import BlogItem from '@/components/blogItem/BlogItem'
import Article from '@/components/article/Article'
import Divider from '@/components/divider/Divider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useNavigate } from 'react-router-dom'
import PlayButton from '@/components/playButton/PlayButton'
import { COLOR } from '@/styles/color'
import { useRandomBlogList } from '@/hooks/queries/useRandomBlogList'
import { useNavigationHistory } from '@/hooks'

const BlogFeedHeader = ({ onNext, onPrev }: { onNext?: () => void; onPrev?: () => void }) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const { data: totalBlogCount } = useBlogCount({
    subcategoryId: 'all',
    recentDays: 'all',
  })

  const { data: recentMonthCount } = useBlogCount({
    subcategoryId: 'all',
    recentDays: 30,
  })

  return (
    <header className={styles['header-container']}>
      <div className={styles['text-wrapper']}>
        <h2 className={styles.title}>변호사의 글</h2>
        <div className={styles.count}>
          <span className={styles['count-number']}>전체 {totalBlogCount?.toLocaleString()}개 / </span>
          <span className={styles['count-number']}>최근 한달 {recentMonthCount?.toLocaleString()}개</span>
        </div>
      </div>
      {!isMobile && <PlayButton iconColor={COLOR.text_black} onNext={onNext} onPrev={onPrev} />}
    </header>
  )
}

const BlogFeedContainer = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const navigate = useNavigate()

  const { currentExcludeIds, handleNext, handlePrev, canGoPrev } = useNavigationHistory()

  const { blogList, hasNextPage } = useRandomBlogList({
    subcategoryId: 'all',
    take: 4,
    excludeIds: currentExcludeIds,
  })

  const subBlogList = isMobile ? blogList : blogList.slice(1, 4)

  const handleBlogClick = (subcategoryId: number, blogId: number) => {
    navigate(`/${subcategoryId}/blog/${blogId}`)
  }

  return (
    <section className={styles.container}>
      <BlogFeedHeader
        onNext={
          hasNextPage
            ? () => {
                const currentIds = blogList.map(blog => blog.blogCaseId)
                handleNext(currentIds)
              }
            : undefined
        }
        onPrev={canGoPrev ? handlePrev : undefined}
      />
      <div className={styles['blog-list-container']}>
        <div className={`${styles['main-blog-item']} ${isMobile ? styles.hidden : ''}`}>
          {blogList[0] && (
            <Article
              type='xxlarge'
              thumbnailUrl={blogList[0].thumbnail}
              title={blogList[0].title}
              content={blogList[0].summaryContent}
              lawyerInfo={{
                name: blogList[0].lawyerName,
                profileImageUrl: blogList[0].lawyerProfileImage,
              }}
              onClick={() => handleBlogClick(blogList[0].subcategoryId, blogList[0].blogCaseId)}
            />
          )}
        </div>
        <div className={styles['sub-blog-list']}>
          {subBlogList.map((blog, idx) => (
            <React.Fragment key={blog.blogCaseId}>
              <BlogItem
                item={blog}
                className={styles['sub-blog-list-item']}
                onClick={() => handleBlogClick(blog.subcategoryId, blog.blogCaseId)}
              />
              {isMobile || (idx !== subBlogList.length - 1 && <Divider padding={29} />)}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogFeedContainer
