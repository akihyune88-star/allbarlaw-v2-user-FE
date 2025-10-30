import AiRecommenderContentSlider from '@/components/slider/AiRecommenderContentSlider'
import { useNavigate } from 'react-router-dom'
import { VideoCase } from '@/types/videoTypes'
import VideoThumbnail from '@/components/video/VideoThumbnail'
import { useRandomVideoList } from '@/hooks/queries/useRandomVideoList'
import styles from './aiVideoCarousel.module.scss'

const AiVideoCarousel = ({ subcategoryId, take }: { subcategoryId: number | 'all'; take: number }) => {
  const { videoList } = useRandomVideoList({
    subcategoryId,
    take,
  })

  const navigate = useNavigate()

  const handleVideoItemClick = (video: VideoCase) => {
    navigate(`/${video.subcategoryId}/video/${video.videoCaseId}`)
  }

  return (
    <AiRecommenderContentSlider title='AI 추천 영상' autoPlay={true} itemsPerSlide={2}>
      {videoList?.map(video => {
        return (
          <div key={video.videoCaseId} className={styles.videoItem}>
            <VideoThumbnail
              size={'large'}
              imgUrl={video.thumbnail}
              title={video.title}
              // lawyerName={video.lawyerName}
              // description={video.summaryContent}
              onClick={() => handleVideoItemClick(video)}
            />
          </div>
        )
      })}
    </AiRecommenderContentSlider>
  )
}

export default AiVideoCarousel
