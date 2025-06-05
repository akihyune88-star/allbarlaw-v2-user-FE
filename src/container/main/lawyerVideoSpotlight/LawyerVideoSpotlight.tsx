import { useGetVideoCount } from '@/hooks/queries/useGetVideoCount'
import styles from './lawyer-video-spotlight.module.scss'
import { useGetVideoList } from '@/hooks/queries/useGetVideoList'
import VideoThumbnail from '@/components/video/VideoThumbnail'

const LawyerVideoSpotlightHeader = () => {
  const { data: totalVideoCount } = useGetVideoCount({
    subcategoryId: 'all',
    recentDays: 'all',
  })

  const { data: recentMonthVideoCount } = useGetVideoCount({
    subcategoryId: 'all',
    recentDays: 30,
  })

  return (
    <header className={styles.header}>
      <h2 className={styles.title}>변호사의 영상</h2>
      <div className={styles.count}>
        <span className={styles['count-number']}>전체 {totalVideoCount?.toLocaleString()}개 / </span>
        <span className={styles['count-number']}>최근 한달 {recentMonthVideoCount?.toLocaleString()}개</span>
      </div>
    </header>
  )
}

const LawyerVideoSpotlight = () => {
  const { videoList } = useGetVideoList({
    subcategoryId: 'all',
    take: 3,
    orderBy: 'createdAt',
  })

  return (
    <section className={styles.container}>
      <LawyerVideoSpotlightHeader />
      <div className={styles['video-grid-container']}>
        {videoList.map(video => (
          <VideoThumbnail key={video.videoCaseId} title={video.title} imgUrl={video.thumbnail} size='large' />
        ))}
      </div>
    </section>
  )
}

export default LawyerVideoSpotlight
