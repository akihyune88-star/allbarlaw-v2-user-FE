import AILoading from '@/components/aiLoading/AILoading'
import DetailHeader from '@/components/detailHeader/DetailHeader'
import VideoPlayerContainer from '@/container/video/videoPlayerContainer/VideoPlayerContainer'
import { useDelayedLoading } from '@/hooks'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useParams } from 'react-router-dom'
import { useGetVideoDetail } from '@/hooks/queries/useGetVideoDetail'
import VidoeInfo from '@/container/video/VidoeInfo'
import styles from './video-detail.module.scss'
import VideoSummary from '@/container/video/videoSummary/VideoSummary'
import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import BlogDetailSideBar from '@/container/blog/BlogDetailSideBar'
import AiVideoRecommender from '@/container/video/aiVideoRecommender/AiVideoRecommender'
import AiRecommenderVideoSlider from '@/container/video/AiRecommenderVideoSlider'

const VideoDetail = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const { showLoading } = useDelayedLoading({ delay: 3000 })
  const { data } = useGetVideoDetail({ videoCaseId: Number(videoId) })

  const lawyer = {
    id: data?.lawyerId || '',
    name: data?.lawyerName || '',
    lawfirm: data?.lawfirmName || '',
    profileImage: data?.lawyerProfileImage || '',
  }

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
              <div className={styles['video-detail-content']} style={{ paddingRight: isMobile ? '0' : '1.5rem' }}>
                <VidoeInfo
                  channelThumbnail={data?.channelThumbnail || ''}
                  channelName={data?.channelName || ''}
                  handleName={data?.handleName || ''}
                  subscriberCount={data?.subscriberCount || 0}
                  channelDescription={data?.channelDescription || ''}
                  source={data?.source || ''}
                />
                <VideoSummary summary={data?.summaryContent || ''} />
                {!isMobile ? (
                  <ContentsRecommender showDivider={false} title='AI 추천영상' contents={<AiVideoRecommender />} />
                ) : (
                  <div className={styles['video-detail-mobile-side']}>
                    <LawyerHorizon
                      className={styles['lawyer-horizon']}
                      name={data?.lawyerName || ''}
                      description={data?.lawfirmName || ''}
                      profileImage={data?.lawyerProfileImage || ''}
                      buttonComponent={
                        <div className={styles['lawyer-contact-btn-wrapper']}>
                          <button>변호사 정보</button>
                          <button>바로톡</button>
                        </div>
                      }
                    />
                    <AiRecommenderVideoSlider />
                    <ContentsRecommender
                      isRefresh={true}
                      title='AI 추천 변호사'
                      contents={
                        <div className={styles['ai-recommender-lawyer']}>
                          {mockLawyerList.map(lawyer => (
                            <LawyerHorizon
                              key={lawyer.id}
                              name={lawyer.name}
                              profileImage={lawyer.profileImage}
                              description={lawyer.description}
                              size='x-small'
                            />
                          ))}
                        </div>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {!isMobile && <BlogDetailSideBar showLoading={showLoading} lawyer={lawyer || {}} recommendLawyerList={[]} />}
      </div>
    </div>
  )
}

export default VideoDetail

const mockLawyerList = [
  {
    id: 1,
    name: '이보람',
    description: '이보람은 경찰 고소 공범 통장 보이스피싱 사기공범 신고 은행 경찰 고소에 능하며 어쩌구 저쩌구 ',
    profileImage: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
  },
  {
    id: 1,
    name: '이보람',
    description: '이보람은 경찰 고소 공범 통장 보이스피싱 사기공범 신고 은행 경찰 고소에 능하며 어쩌구 저쩌구 ',
    profileImage: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
  },
  {
    id: 1,
    name: '이보람',
    description: '이보람은 경찰 고소 공범 통장 보이스피싱 사기공범 신고 은행 경찰 고소에 능하며 어쩌구 저쩌구 ',
    profileImage: 'https://cdn.goenhance.ai/user/2024/07/12/6df8872f-c15e-442f-a4df-caa520c34c77_1.jpg',
  },
]
