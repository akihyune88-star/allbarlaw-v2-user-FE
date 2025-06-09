import AILoading from '@/components/aiLoading/AILoading'
import DetailHeader from '@/components/detailHeader/DetailHeader'
import VideoPlayerContainer from '@/container/video/videoPlayerContainer/VideoPlayerContainer'
import VideoDetailSideBar from '@/container/video/VideoDetailSideBar'
import { useDelayedLoading } from '@/hooks'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useParams } from 'react-router-dom'
import { useGetVideoDetail } from '@/hooks/queries/useGetVideoDetail'
import VidoeInfo from '@/container/video/VidoeInfo'
import styles from './video-detail.module.scss'
import VideoSummary from '@/container/video/videoSummary/VideoSummary'
import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'

const VideoDetail = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const { showLoading } = useDelayedLoading({ delay: 3000 })
  const { data } = useGetVideoDetail({ videoCaseId: Number(videoId) })

  return (
    <div className={'detail-container'}>
      <DetailHeader title={data?.title || ''} />
      <div className={'detail-body'}>
        <div>
          {showLoading ? (
            <AILoading title='AI가 해당 비디오의 정보를 분석중입니다.' />
          ) : (
            <div>
              <VideoPlayerContainer videoUrl={data?.source} tags={data?.tags} className={styles['mobile-no-padding']} />
              <div className={styles['video-detail-content']}>
                <VidoeInfo
                  channelThumbnail={data?.channelThumbnail || ''}
                  channelName={data?.channelName || ''}
                  handleName={data?.handleName || ''}
                  subscriberCount={data?.subscriberCount || 0}
                  channelDescription={data?.channelDescription || ''}
                />
                <VideoSummary summary={data?.summaryContent || ''} />
                {!isMobile && <ContentsRecommender title='AI 추천영상' contents={<div>123</div>} />}
              </div>
            </div>
          )}
        </div>
        {!isMobile && <VideoDetailSideBar />}
      </div>
    </div>
  )
}

export default VideoDetail
