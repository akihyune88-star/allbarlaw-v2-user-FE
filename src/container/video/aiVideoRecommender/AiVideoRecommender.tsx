import VideoThumbnail from '@/components/video/VideoThumbnail'

import styles from './ai-video-recommender.module.scss'
import { VideoCase } from '@/types/videoTypes'

type AiVideoRecommenderProps = {
  videoCaseId?: number
  videoList: VideoCase[]
}

const AiVideoRecommender = ({ videoList }: AiVideoRecommenderProps) => {
  return (
    <div className={styles['ai-recommender-video-grid']}>
      {videoList.map(video => (
        <VideoThumbnail
          key={video.videoCaseId}
          size={'small'}
          imgUrl={video.thumbnail}
          lawyerName={video.lawyerName}
          description={video.summaryContent}
        />
      ))}
    </div>
  )
}

export default AiVideoRecommender
