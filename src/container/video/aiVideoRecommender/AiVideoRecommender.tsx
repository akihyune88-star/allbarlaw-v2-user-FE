import VideoThumbnail from '@/components/video/VideoThumbnail'
import { useGetVideoList } from '@/hooks/queries/useGetVideoList'
import { useParams } from 'react-router-dom'
import styles from './ai-video-recommender.module.scss'

type AiVideoRecommenderProps = {
  videoCaseId?: number
}

const AiVideoRecommender = ({ videoCaseId }: AiVideoRecommenderProps) => {
  console.log(videoCaseId)
  const { subcategoryId } = useParams<{ subcategoryId: string }>()

  const { videoList } = useGetVideoList({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    take: 3,
  })

  const slicedVideoList = videoList.slice(0, 3)

  return (
    <div className={styles['ai-recommender-video-grid']}>
      {slicedVideoList.map(video => (
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
