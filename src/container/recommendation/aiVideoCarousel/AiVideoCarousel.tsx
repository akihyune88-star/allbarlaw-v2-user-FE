import AiRecommenderContentSlider from '@/components/slider/AiRecommenderContentSlider'
import { useNavigate } from 'react-router-dom'
import { VideoCase } from '@/types/videoTypes'
import VideoThumbnail from '@/components/video/VideoThumbnail'
import { useRandomVideoList } from '@/hooks/queries/useRandomVideoList'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import RecommenderVideo from '@/components/aiRecommender/RecommenderVideo'

const AiVideoCarousel = ({ subcategoryId, take }: { subcategoryId: number | 'all'; take: number }) => {
  const { videoList } = useRandomVideoList({
    subcategoryId,
    take,
  })

  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const handleVideoItemClick = (video: VideoCase) => {
    navigate(`/${video.subcategoryId}/video/${video.videoCaseId}`)
  }

  return (
    <AiRecommenderContentSlider title='AI 추천 영상' autoPlay={true} itemsPerSlide={isMobile ? 1 : 2}>
      {videoList?.map(video => {
        return (
          <>
            {isMobile ? (
              <RecommenderVideo
                key={`recommender-video-mobile-${video.videoCaseId}`}
                videoUrl={video.thumbnail}
                title={video.title}
                description={video.title}
                onClick={() => handleVideoItemClick(video)}
                showBookmarkButton={false}
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
