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
  const [currentIndex, setCurrentIndex] = useState(1) // 0: prev, 1: current, 2: next
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const { currentExcludeIds, handleNext, handlePrev, canGoPrev } = useNavigationHistory()

  // 현재 데이터
  const {
    blogList: currentBlogs,
    hasNextPage,
    refetch,
  } = useRandomBlogList({
    subcategoryId: 'all',
    take: isMobile ? 3 : 4,
    excludeIds: currentExcludeIds,
  })

  // 다음 데이터 미리 fetching
  const nextExcludeIds = [...currentExcludeIds, ...currentBlogs.map(blog => blog.blogCaseId)]

  const { blogList: nextBlogs } = useRandomBlogList({
    subcategoryId: 'all',
    take: isMobile ? 3 : 4,
    excludeIds: nextExcludeIds,
    enabled: hasNextPage,
  })

  const handleBlogClick = (subcategoryId: number, blogId: number) => {
    navigate(`/${subcategoryId}/blog/${blogId}`)
  }

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev)
  }

  const goToNext = () => {
    if (hasNextPage && !isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex(2)

      setTimeout(() => {
        const currentIds = currentBlogs.map(blog => blog.blogCaseId)
        handleNext(currentIds)
        setCurrentIndex(1)
        setIsTransitioning(false)
      }, 500)
    }
  }

  const goToPrev = () => {
    if (canGoPrev && !isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex(0)

      setTimeout(() => {
        handlePrev()
        setCurrentIndex(1)
        setIsTransitioning(false)
      }, 500)
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
  }, [isPlaying, hasNextPage, currentBlogs, isMobile])

  const renderBlogContent = (blogs: typeof currentBlogs) => {
    // 데이터가 없으면 빈 컨테이너 반환
    if (!blogs || blogs.length === 0) {
      return <div className={styles['blog-list-container']} />
    }

    const subList = isMobile ? blogs : blogs.slice(1, 4)

    return (
      <div className={styles['blog-list-container']}>
        <div className={`${styles['main-blog-item']} ${isMobile ? styles.hidden : ''}`}>
          {blogs[0] && (
            <Article
              type='xxlarge'
              thumbnailUrl={blogs[0].thumbnail || ''}
              title={blogs[0].title || ''}
              content={blogs[0].summaryContent || ''}
              className={styles['main-blog-item']}
              lawyerInfo={{
                name: blogs[0].lawyerName || '',
                lawfirmName: blogs[0]?.lawfirmName || '',
                profileImageUrl: blogs[0].lawyerProfileImage || '',
              }}
              onClick={() => handleBlogClick(blogs[0].subcategoryId, blogs[0].blogCaseId)}
            />
          )}
        </div>
        <div className={styles['sub-blog-list']}>
          {subList.map((blog, idx) => (
            <React.Fragment key={blog.blogCaseId}>
              <BlogItem
                type='regular'
                item={blog}
                isShowKeep={false}
                className={styles['sub-blog-list-item']}
                onClick={() => handleBlogClick(blog.subcategoryId, blog.blogCaseId)}
              />
              {isMobile || (idx !== subList.length - 1 && <Divider padding={29} />)}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className={styles.container}>
      <BlogFeedHeader
        refetch={refetch}
        onNext={hasNextPage ? goToNext : undefined}
        onPrev={canGoPrev ? goToPrev : undefined}
        onToggle={handleTogglePlay}
        isPlaying={isPlaying}
      />
      {isMobile ? (
        // 모바일: 슬라이더 없이 바로 블로그 리스트 표시
        renderBlogContent(currentBlogs)
      ) : (
        // 데스크톱: 슬라이더 구조 유지
        <div className={styles['slider-wrapper']}>
          <div
            className={styles['slider-track']}
            style={{
              transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
              transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
            }}
          >
            {/* 이전 슬라이드 (placeholder) */}
            <div className={styles['slide']}>{renderBlogContent(currentBlogs)}</div>

            {/* 현재 슬라이드 */}
            <div className={styles['slide']}>{renderBlogContent(currentBlogs)}</div>

            {/* 다음 슬라이드 */}
            <div className={styles['slide']}>
              {nextBlogs.length > 0 ? renderBlogContent(nextBlogs) : renderBlogContent(currentBlogs)}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default BlogFeedContainer
