import AiRecommenderContentSlider from '@/components/slider/AiRecommenderContentSlider'
import { useNavigate } from 'react-router-dom'
import { VideoCase } from '@/types/videoTypes'
import VideoThumbnail from '@/components/video/VideoThumbnail'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useRandomVideoList } from '@/hooks/queries/useRandomVideoList'

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
          <VideoThumbnail
            key={video.videoCaseId}
            size={'large'}
            imgUrl={video.thumbnail}
            lawyerName={video.lawyerName}
            description={video.summaryContent}
            onClick={() => handleVideoItemClick(video)}
          />
        )
      })}
    </AiRecommenderContentSlider>
  )
}

export default AiVideoCarousel
