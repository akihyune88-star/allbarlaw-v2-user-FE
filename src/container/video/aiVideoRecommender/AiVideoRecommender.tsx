import VideoThumbnail from '@/components/video/VideoThumbnail'

import styles from './ai-video-recommender.module.scss'
import { VideoCase } from '@/types/videoTypes'
import { useNavigate } from 'react-router-dom'

type AiVideoRecommenderProps = {
  videoCaseId?: number
  videoList: VideoCase[]
  subcategoryId: number
}

const AiVideoRecommender = ({ videoList, subcategoryId }: AiVideoRecommenderProps) => {
  const navigate = useNavigate()
  const handleVideoItemClick = (videoId: number) => {
    navigate(`/${subcategoryId}/video/${videoId}`)
  }

  return (
    <div className={styles['ai-recommender-video-grid']}>
      {videoList.map(video => (
        <VideoThumbnail
          key={video.videoCaseId}
          size={'small'}
          imgUrl={video.thumbnail}
          lawyerName={video.lawyerName}
          description={video.summaryContent}
          onClick={() => handleVideoItemClick(video.videoCaseId)}
        />
      ))}
    </div>
  )
}

export default AiVideoRecommender
