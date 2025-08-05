import Divider from '@/components/divider/Divider'
import SvgIcon from '@/components/SvgIcon'
import styles from './lawyerVideo.module.scss'
import { useGetVideoList } from '@/hooks/queries/useGetVideoList'
import VideoHorizon from '@/components/video/VideoHorizon'
import { forwardRef } from 'react'

const LawyerVideo = forwardRef<HTMLElement>((props, ref) => {
  const { videoList } = useGetVideoList({
    subcategoryId: 'all',
    take: 3,
  })

  const threeVideoList = videoList.slice(0, 3)

  return (
    <section ref={ref} className={styles['lawyer-video']} aria-label='변호사의 영상'>
      <header className={styles['lawyer-video__header']}>
        <h3 className={styles['lawyer-video__title']}>변호사의 영상</h3>
        <button type='button' className={styles['lawyer-video__button']} aria-label='변호사의 영상 더보기'>
          더보기
          <SvgIcon name='arrowSmall' className={styles['lawyer-video__button-icon']} size={14} />
        </button>
      </header>
      <Divider padding={14} />
      <ul className={styles['lawyer-video__list']} role='list'>
        {threeVideoList.map((video, index) => (
          <li key={video.videoCaseId}>
            <VideoHorizon
              size='small'
              thumbnailUrl={video.thumbnail}
              title={video.title}
              summaryContents={video.summaryContent}
            />
            {index !== threeVideoList.length - 1 && (
              <Divider padding={12} className={styles['lawyer-video__divider']} />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
})

LawyerVideo.displayName = 'LawyerVideo'

export default LawyerVideo
