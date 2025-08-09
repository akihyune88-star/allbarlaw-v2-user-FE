import VideoSlider from '../../components/slider/VideoSlider'
import { VideoCase } from '@/types/videoTypes'

type AiRecommenderVideoSliderProps = {
  videoList: VideoCase[]
}

const AiRecommenderVideoSlider = ({ videoList }: AiRecommenderVideoSliderProps) => {
  const videos = videoList?.map(video => ({
    id: video.videoCaseId,
    title: video.title,
    thumbnail: video.thumbnail,
    channelName: video.channelName,
  }))

  return <VideoSlider title='AI 추천영상' videos={videos} autoPlay={true} />
}

export default AiRecommenderVideoSlider
