import { useParams } from 'react-router-dom'
import VideoSlider from '../../components/slider/VideoSlider'
import { useGetVideoList } from '@/hooks/queries/useGetVideoList'

const AiRecommenderVideoSlider = () => {
  const { subcategoryId } = useParams<{ subcategoryId: string }>()

  const { videoList } = useGetVideoList({
    subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    take: 3,
  })

  const sliderVideos = videoList?.slice(0, 3)
  const videos = sliderVideos?.map(video => ({
    id: video.videoCaseId,
    title: video.title,
    thumbnail: video.thumbnail,
    channelName: video.channelName,
  }))

  return <VideoSlider title='AI 추천영상' videos={videos} autoPlay={true} />
}

export default AiRecommenderVideoSlider
