import AiRecommenderContentSlider from '@/components/slider/AiRecommenderContentSlider'
import { useRecommendationVideo } from '@/hooks/queries/useRecommendation'
import { useNavigate } from 'react-router-dom'
import { VideoCase } from '@/types/videoTypes'
import VideoThumbnail from '@/components/video/VideoThumbnail'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import RecommenderVideo from '@/components/aiRecommender/RecommenderVideo'

const AiVideoCarousel = ({ subcategoryId, take }: { subcategoryId: number | 'all'; take: number }) => {
  const { data: recommendationVideo } = useRecommendationVideo({
    subcategoryId,
    take,
  })

  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const handleVideoItemClick = (video: VideoCase) => {
    navigate(`/${video.subcategoryId}/video/${video.videoCaseId}`)
  }

  return (
    <AiRecommenderContentSlider title='AI 추천 영상' autoPlay={true} itemsPerSlide={isMobile ? 1 : 3}>
      {recommendationVideo?.map(video => {
        return (
          <>
            {isMobile ? (
              <RecommenderVideo
                key={video.videoCaseId}
                videoUrl={video.thumbnail}
                description={video.title}
                onClick={() => handleVideoItemClick(video)}
              />
            ) : (
              <VideoThumbnail
                key={video.videoCaseId}
                size={isMobile ? 'text' : 'small'}
                imgUrl={video.thumbnail}
                lawyerName={video.lawyerName}
                description={video.summaryContent}
                onClick={() => handleVideoItemClick(video)}
              />
            )}
          </>
        )
      })}
    </AiRecommenderContentSlider>
  )
}

export default AiVideoCarousel
