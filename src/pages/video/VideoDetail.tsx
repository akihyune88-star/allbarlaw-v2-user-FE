import AILoading from '@/components/aiLoading/AILoading'
import DetailHeader from '@/components/detailHeader/DetailHeader'
import VideoPlayerContainer from '@/container/video/VideoPlayerContainer'
import VideoDetailSideBar from '@/container/video/VideoDetailSideBar'
import { useDelayedLoading } from '@/hooks'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useParams } from 'react-router-dom'
import { useGetVideoDetail } from '@/hooks/queries/useGetVideoDetail'

const VideoDetail = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const { showLoading } = useDelayedLoading({ delay: 3000 })
  const { data } = useGetVideoDetail({ videoCaseId: Number(videoId) })
  console.log('data', data)

  return (
    <div className={'detail-container'}>
      <DetailHeader title={data?.title || ''} />
      <div className={'detail-body'}>
        <div>
          {showLoading ? (
            <AILoading title='AI가 해당 비디오의 정보를 분석중입니다.' />
          ) : (
            <div>
              <VideoPlayerContainer videoUrl={data?.source} tags={data?.tags} />
            </div>
          )}
        </div>
        {!isMobile && <VideoDetailSideBar />}
      </div>
    </div>
  )
}

export default VideoDetail
