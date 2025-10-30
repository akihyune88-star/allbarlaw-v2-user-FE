import styles from './lawyer-video-spotlight.module.scss'
import { VideoCase } from '@/types/videoTypes'
import VideoThumbnail from '@/components/video/VideoThumbnail'

interface DesktopVidoeSpotlightProps {
  allVideos: VideoCase[]
  slideIndex: number
  isTransitioning: boolean
  isMobile: boolean
  handleVideoClick: (_subcategoryId: number, _videoId: number) => void
}

const DesktopVidoeSpotlight = ({
  allVideos,
  slideIndex,
  isTransitioning,
  isMobile,
  handleVideoClick,
}: DesktopVidoeSpotlightProps) => {
  // PC: 3개 보여주기, 모바일: 2개 보여주기
  const itemWidth = 320 // PC 각 아이템 너비
  const itemGap = 24 // PC 아이템 간격

  const getTransform = () => {
    if (isMobile) {
      // 모바일: 각 슬라이드마다 (50% + 8px)씩 이동
      // 슬라이드 0: 0
      // 슬라이드 1: -(50% + 8px)
      // 슬라이드 2: -(100% + 16px)
      return `translate3d(calc(-${slideIndex * 50}% - ${slideIndex * 8}px), 0, 0)`
    }
    // PC: 픽셀 기반 이동
    return `translate3d(-${slideIndex * (itemWidth + itemGap)}px, 0, 0)`
  }

  return (
    <div className={styles['slider-wrapper']}>
      <div
        className={styles['slider-track']}
        style={{
          transform: getTransform(),
          transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
        }}
      >
        {allVideos.map(video => (
          <div key={video.videoCaseId} className={styles['video-item']}>
            <VideoThumbnail
              title={video.title}
              imgUrl={video.thumbnail}
              size='large'
              onClick={() => handleVideoClick(video.subcategoryId, video.videoCaseId)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default DesktopVidoeSpotlight
