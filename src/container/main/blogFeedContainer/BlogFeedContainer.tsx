import React, { useState, useEffect, useRef } from 'react'
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
import SvgIcon from '@/components/SvgIcon'
import { useBlogCount } from '@/hooks/queries/useBlog'

const BlogFeedHeader = ({
  onNext,
  onPrev,
  onToggle,
  isPlaying,
  refetch,
}: {
  onNext?: () => void
  onPrev?: () => void
  onToggle?: () => void
  isPlaying?: boolean
  refetch?: () => void
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
      {!isMobile ? (
        <PlayButton
          iconColor={COLOR.text_black}
          onNext={onNext}
          onPrev={onPrev}
          onToggle={onToggle}
          isPlaying={isPlaying}
        />
      ) : (
        <SvgIcon name='refresh' size={16} onClick={refetch} style={{ cursor: 'pointer' }} />
      )}
    </header>
  )
}

const BlogFeedContainer = () => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(true)
  const intervalRef = useRef<number | null>(null)

  const { currentExcludeIds, handleNext, handlePrev, canGoPrev } = useNavigationHistory()

  const { blogList, hasNextPage, refetch } = useRandomBlogList({
    subcategoryId: 'all',
    take: isMobile ? 3 : 4,
    excludeIds: currentExcludeIds,
  })

  const subBlogList = isMobile ? blogList : blogList.slice(1, 4)

  const handleBlogClick = (subcategoryId: number, blogId: number) => {
    navigate(`/${subcategoryId}/blog/${blogId}`)
  }

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev)
  }

  const goToNext = () => {
    if (hasNextPage) {
      const currentIds = blogList.map(blog => blog.blogCaseId)
      handleNext(currentIds)
    }
  }

  useEffect(() => {
    if (isPlaying && !isMobile) {
      intervalRef.current = window.setInterval(() => {
        goToNext()
      }, 3000)
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, hasNextPage, blogList, isMobile])

  return (
    <section className={styles.container}>
      <BlogFeedHeader
        refetch={refetch}
        onNext={hasNextPage ? goToNext : undefined}
        onPrev={canGoPrev ? handlePrev : undefined}
        onToggle={handleTogglePlay}
        isPlaying={isPlaying}
      />
      <div className={styles['blog-list-container']}>
        <div className={`${styles['main-blog-item']} ${isMobile ? styles.hidden : ''}`}>
          {blogList[0] && (
            <Article
              type='xxlarge'
              thumbnailUrl={blogList[0].thumbnail}
              title={blogList[0].title}
              content={blogList[0].summaryContent}
              className={styles['main-blog-item']}
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
                type='regular'
                item={blog}
                isShowKeep={false}
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
