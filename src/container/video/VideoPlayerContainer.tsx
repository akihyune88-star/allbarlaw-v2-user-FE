import YoutubePlayer from '@/components/youtubePlayer/YoutubePlayer'
import { extractYouTubeVideoId } from '@/utils/youtubeUtils'
import styles from './video-player-container.module.scss'

type VideoPlayerContainerProps = {
  videoUrl?: string
  tags?: string[]
  className?: string
  maxWidth?: string | number
}

const VideoPlayerContainer = ({ videoUrl, tags = [], className, maxWidth }: VideoPlayerContainerProps) => {
  // 비디오 URL 유효성 검사
  const isValidVideoUrl = videoUrl && extractYouTubeVideoId(videoUrl)

  // 컨테이너 스타일 - maxWidth가 명시적으로 설정된 경우에만 적용
  const containerStyle = maxWidth ? { width: '100%', maxWidth } : {}

  // 에러 상태일 때 표시할 컴포넌트
  if (!isValidVideoUrl) {
    return (
      <div className={`${styles['video-player-wrapper']} ${className}`} style={containerStyle}>
        <div className={styles['video-error']}>
          {!videoUrl ? '비디오를 불러올 수 없습니다.' : '유효하지 않은 YouTube 링크입니다.'}
        </div>
        {tags.length > 0 && (
          <div className={styles['video-tag-list']}>
            {tags.map(tag => (
              <div key={tag} className={styles['video-tag-item']}>
                #{tag}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`${styles['video-player-wrapper']} ${className}`} style={containerStyle}>
      <div className={styles['video-player-container']}>
        <YoutubePlayer url={videoUrl} />
      </div>
      {tags.length > 0 && (
        <div className={styles['video-tag-list']}>
          {tags.map(tag => (
            <div key={tag} className={styles['video-tag-item']}>
              #{tag}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VideoPlayerContainer
