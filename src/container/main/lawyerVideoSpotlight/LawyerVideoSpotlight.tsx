import { useGetVideoCount } from '@/hooks/queries/useGetVideoCount'
import styles from './lawyer-video-spotlight.module.scss'
import { useRandomVideoList } from '@/hooks/queries/useRandomVideoList'
import VideoThumbnail from '@/components/video/VideoThumbnail'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import PlayButton from '@/components/playButton/PlayButton'
import { COLOR } from '@/styles/color'
import { useNavigationHistory } from '@/hooks'

const LawyerVideoSpotlightHeader = ({ onNext, onPrev }: { onNext?: () => void; onPrev?: () => void }) => {
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
      {!isMobile && <PlayButton iconColor={COLOR.text_black} onNext={onNext} onPrev={onPrev} />}
    </header>
  )
}

const LawyerVideoSpotlight = () => {
  const navigate = useNavigate()

  const { currentExcludeIds, handleNext, handlePrev, canGoPrev } = useNavigationHistory()

  const { videoList, hasNextPage } = useRandomVideoList({
    subcategoryId: 'all',
    take: 3,
    excludeIds: currentExcludeIds,
  })

  const handleNextClick = () => {
    const currentIds = videoList.map(video => video.videoCaseId)
    handleNext(currentIds)
  }

  const handleVideoClick = (subcategoryId: number, videoId: number) => {
    navigate(`/${subcategoryId}/video/${videoId}`)
  }

  return (
    <section className={styles.container}>
      <LawyerVideoSpotlightHeader
        onNext={hasNextPage ? handleNextClick : undefined}
        onPrev={canGoPrev ? handlePrev : undefined}
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
