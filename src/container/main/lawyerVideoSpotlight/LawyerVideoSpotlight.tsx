import { useState, useEffect, useRef } from 'react'
import styles from './lawyer-video-spotlight.module.scss'
import { useRandomVideoList } from '@/hooks/queries/useRandomVideoList'
import VideoThumbnail from '@/components/video/VideoThumbnail'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import PlayButton from '@/components/playButton/PlayButton'
import { COLOR } from '@/styles/color'
import { useNavigationHistory } from '@/hooks'
import SvgIcon from '@/components/SvgIcon'
import { useGetVideoCount } from '@/hooks/queries/useVideo'

const LawyerVideoSpotlightHeader = ({
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

  const { data: totalVideoCount } = useGetVideoCount({
    subcategoryId: 'all',
    recentDays: 'all',
  })

  const { data: recentMonthVideoCount } = useGetVideoCount({
    subcategoryId: 'all',
    recentDays: 30,
  })

  return (
    <header className={styles['header-container']}>
      <div className={styles['text-wrapper']}>
        <h2 className={styles.title}>변호사의 영상</h2>
        <div className={styles.count}>
          <span className={styles['count-number']}>전체 {totalVideoCount?.toLocaleString()}개 / </span>
          <span className={styles['count-number']}>최근 한달 {recentMonthVideoCount?.toLocaleString()}개</span>
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

const LawyerVideoSpotlight = () => {
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(true)
  const intervalRef = useRef<number | null>(null)
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const { currentExcludeIds, handleNext, handlePrev, canGoPrev, reset } = useNavigationHistory()

  const { videoList, hasNextPage, refetch } = useRandomVideoList({
    subcategoryId: 'all',
    take: 3,
    excludeIds: currentExcludeIds,
  })

  const handleNextClick = () => {
    if (!hasNextPage) {
      // 더 이상 불러올 영상이 없으면 처음부터 다시 시작
      reset()
      refetch()
    } else if (videoList && videoList.length > 0) {
      const currentIds = videoList.map(video => video.videoCaseId)
      handleNext(currentIds)
    }
  }

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev)
  }

  useEffect(() => {
    if (isPlaying && !isMobile) {
      intervalRef.current = window.setInterval(() => {
        handleNextClick()
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
  }, [isPlaying, hasNextPage, videoList, isMobile])

  const handleVideoClick = (subcategoryId: number, videoId: number) => {
    navigate(`/${subcategoryId}/video/${videoId}`)
  }

  return (
    <section className={styles.container}>
      <LawyerVideoSpotlightHeader
        onNext={hasNextPage ? handleNextClick : undefined}
        onPrev={canGoPrev ? handlePrev : undefined}
        onToggle={handleTogglePlay}
        isPlaying={isPlaying}
        refetch={refetch}
      />
      <div className={styles['video-grid-container']}>
        {videoList.map(video => (
          <VideoThumbnail
            key={video.videoCaseId}
            title={video.title}
            imgUrl={video.thumbnail}
            size='large'
            onClick={() => handleVideoClick(video.subcategoryId, video.videoCaseId)}
          />
        ))}
      </div>
    </section>
  )
}

export default LawyerVideoSpotlight
