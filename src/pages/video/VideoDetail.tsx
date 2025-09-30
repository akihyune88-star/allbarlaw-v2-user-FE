import AILoading from '@/components/aiLoading/AILoading'
import DetailHeader from '@/components/detailHeader/DetailHeader'
import VideoPlayerContainer from '@/container/video/videoPlayerContainer/VideoPlayerContainer'
import { useDelayedLoading } from '@/hooks'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetVideoDetail } from '@/hooks/queries/useGetVideoDetail'
import VidoeInfo from '@/container/video/VidoeInfo'
import styles from './video-detail.module.scss'
import VideoSummary from '@/container/video/videoSummary/VideoSummary'
import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import BlogDetailSideBar from '@/container/blog/BlogDetailSideBar'
import AiVideoRecommender from '@/container/video/aiVideoRecommender/AiVideoRecommender'
import { useState, useEffect } from 'react'
import { useVideoKeep } from '@/hooks/queries/useGetVideoList'
import { copyUrlToClipboard } from '@/utils/clipboard'
import { useRecommendationLegalTerm, useRecommendationVideo } from '@/hooks/queries/useRecommendation'
import RecommendationLawyer from '@/container/recommendation/RecommendationLawyer'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import AiVideoCarousel from '@/container/recommendation/aiVideoCarousel/AiVideoCarousel'
import { useAuth } from '@/contexts/AuthContext'
import ConfirmModal from '@/components/modal/ConfirmModal'
import { ROUTER } from '@/routes/routerConstant'

const VideoDetail = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const navigate = useNavigate()

  const { showLoading, setShowLoading } = useDelayedLoading({ delay: 3000 })
  const { data } = useGetVideoDetail({ videoCaseId: Number(videoId) })
  const [isKeep, setIsKeep] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const { isLoggedIn } = useAuth()

  // videoId가 변경될 때마다 로딩 다시 시작
  useEffect(() => {
    setShowLoading(true)
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [videoId, setShowLoading])

  // data가 로드되면 isKeep 상태 업데이트
  useEffect(() => {
    if (data?.isKeep !== undefined) {
      setIsKeep(data.isKeep)
    }
  }, [data?.isKeep])

  const { mutate: changeVideoKeep } = useVideoKeep({
    onSuccess: data => {
      // 서버 응답으로 최종 상태 확인
      setIsKeep(data.isKeep)
    },
    onError: () => {
      console.error('Failed to change video keep')
      // 에러 발생 시 원래 상태로 롤백
      setIsKeep(prevState => !prevState)
    },
  })

  const lawyer = {
    lawyerId: data?.lawyerId || 0,
    name: data?.lawyerName || '',
    lawfirm: data?.lawfirmName || '',
    profileImage: data?.lawyerProfileImage || '',
  }

  const handleShare = () => {
    copyUrlToClipboard()
  }

  const handleSave = () => {
    // 로그인 체크
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }

    if (data?.videoCaseId) {
      // 낙관적 업데이트: 즉시 UI 변경
      setIsKeep(prevState => !prevState)
      changeVideoKeep(data.videoCaseId)
    }
  }

  const handleLoginConfirm = () => {
    setShowLoginModal(false)
    navigate(ROUTER.AUTH)
  }

  const { data: recommendationLegalTerm } = useRecommendationLegalTerm({
    videoCaseIds: [data?.videoCaseId || 0],
  })

  const { data: recommendationVideo } = useRecommendationVideo({
    subcategoryId: data?.subcategoryId || 'all',
    take: 3,
  })

  const handleLawyerClick = (lawyerId: number) => {
    navigate(`/search/lawyer/${lawyerId}`)
  }

  return (
    <div className={'detail-container'}>
      <DetailHeader title={data?.title || ''} onShare={handleShare} onSave={handleSave} isKeep={isKeep} />

      <ConfirmModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onConfirm={handleLoginConfirm}
        message='로그인 후 이용할 수 있습니다.'
        confirmText='확인'
        cancelText='취소'
      />

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
                  <>
                    <ContentsRecommender
                      showDivider={false}
                      title='AI 추천영상'
                      contents={
                        <AiVideoRecommender
                          videoList={recommendationVideo || []}
                          subcategoryId={data?.subcategoryId || 0}
                        />
                      }
                    />
                  </>
                ) : (
                  <div className={styles['video-detail-mobile-side']}>
                    <LawyerHorizon
                      className={styles['lawyer-horizon']}
                      lawyerId={data?.lawyerId || 0}
                      name={data?.lawyerName || ''}
                      lawfirm={data?.lawfirmName || ''}
                      profileImage={data?.lawyerProfileImage || ''}
                      buttonComponent={
                        <div className={styles['lawyer-contact-btn-wrapper']}>
                          <button onClick={() => handleLawyerClick(data?.lawyerId || 0)}>변호사 정보</button>
                          <button>바로톡</button>
                        </div>
                      }
                    />
                    <AiVideoCarousel subcategoryId={data?.subcategoryId || 'all'} take={3} />
                    <RecommendationLawyer />
                    <LegalTermWidget lagalTermList={recommendationLegalTerm || []} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {!isMobile && (
          <BlogDetailSideBar
            showLoading={showLoading}
            lawyer={lawyer || {}}
            blogCaseId={data?.videoCaseId || 0}
            recommendationLegalTerm={recommendationLegalTerm}
          />
        )}
      </div>
    </div>
  )
}

export default VideoDetail
