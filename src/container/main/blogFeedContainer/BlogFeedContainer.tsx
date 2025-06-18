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

const BlogFeedHeader = ({
  onNext,
  onPrev,
  disabledPrev,
}: {
  onNext: () => void
  onPrev: () => void
  disabledPrev: boolean
}) => {
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
      {!isMobile && (
        <PlayButton iconColor={COLOR.text_black} onNext={onNext} onPrev={onPrev} disabledPrev={disabledPrev} />
      )}
    </header>
  )
}

const BlogFeedContainer = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const navigate = useNavigate()

  const { blogList } = useRandomBlogList({
    subcategoryId: 'all',
    take: 4,
    excludeIds: [],
  })

  const { currentExcludeIds, handleNext, handlePrev, canGoPrev } = useNavigationHistory({
    currentData: blogList,
    getItemId: blog => blog.blogCaseId,
  })

  // 실제 데이터 요청에 사용할 훅
  const { blogList: actualBlogList } = useRandomBlogList({
    subcategoryId: 'all',
    take: 4,
    excludeIds: currentExcludeIds,
  })

  const displayBlogList = actualBlogList.length > 0 ? actualBlogList : blogList
  const subBlogList = isMobile ? displayBlogList : displayBlogList.slice(1, 4)

  const handleBlogClick = (subcategoryId: number, blogId: number) => {
    navigate(`/${subcategoryId}/blog/${blogId}`)
  }

  return (
    <section className={styles.container}>
      <BlogFeedHeader onNext={handleNext} onPrev={handlePrev} disabledPrev={!canGoPrev} />
      <div className={styles['blog-list-container']}>
        <div className={`${styles['main-blog-item']} ${isMobile ? styles.hidden : ''}`}>
          {displayBlogList[0] && (
            <Article
              type='xxlarge'
              thumbnailUrl={displayBlogList[0].thumbnail}
              title={displayBlogList[0].title}
              content={displayBlogList[0].summaryContent}
              lawyerInfo={{
                name: displayBlogList[0].lawyerName,
                profileImageUrl: displayBlogList[0].lawyerProfileImage,
              }}
              onClick={() => handleBlogClick(displayBlogList[0].subcategoryId, displayBlogList[0].blogCaseId)}
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
