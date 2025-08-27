import styles from './lawyerVideoDetail.module.scss'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetVideoDetail } from '@/hooks/queries/useGetVideoDetail'
import Button from '@/components/button/Button'
import SvgIcon from '@/components/SvgIcon'
import { COLOR } from '@/styles/color'
import { copyUrlToClipboard } from '@/utils/clipboard'
import { useVideoKeep } from '@/hooks/queries/useGetVideoList'
import { useState } from 'react'
import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import { useLawyerDetailForMe } from '@/hooks/queries/useLawyer'
import { ROUTER } from '@/routes/routerConstant'
import VideoSummary from '@/container/video/videoSummary/VideoSummary'
import DetailHeader from '@/components/detailHeader/DetailHeader'
import YoutubePlayer from '@/components/youtubePlayer/YoutubePlayer'
import { Tag } from '@/types/lawyerTypes'
import VidoeInfo from '@/container/video/VidoeInfo'

type VideoNavigationBarProps = {
  isKeep: boolean
  onSave: () => void
  onShare: () => void
  onVideoLink: () => void
}

const VideoNavigationBar = ({ isKeep, onSave, onShare, onVideoLink }: VideoNavigationBarProps) => {
  return (
    <div className={styles['video-navigation-bar']}>
      <button className={styles['video-link-btn']} onClick={onVideoLink}>
        영상 바로가기
      </button>
      <div className={styles['button-wrapper']}>
        <Button variant='share' onClick={onShare}>
          공유
          <SvgIcon name='share' size={16} />
        </Button>
        <Button variant='save' onClick={onSave}>
          저장 <SvgIcon name='save' size={16} fill={isKeep ? COLOR.icon_darkgreen : 'none'} />
        </Button>
      </div>
    </div>
  )
}

const LawyerVideoDetail = () => {
  const { videoCaseId } = useParams<{ videoCaseId: string }>()
  const navigate = useNavigate()
  const { data } = useGetVideoDetail({ videoCaseId: Number(videoCaseId) })
  const { data: lawyerBasicInfo } = useLawyerDetailForMe()
  const [isKeep, setIsKeep] = useState(false)

  const { mutate: changeVideoKeep } = useVideoKeep({
    onSuccess: data => {
      setIsKeep(data.isKeep)
    },
    onError: () => {
      console.error('Failed to change video keep')
      setIsKeep(prevState => !prevState)
    },
  })

  const handleShare = () => {
    copyUrlToClipboard()
  }

  const handleSave = () => {
    if (data?.videoCaseId) {
      setIsKeep(prevState => !prevState)
      changeVideoKeep(data.videoCaseId)
    }
  }

  const handleVideoLink = () => {
    window.open(data?.source || '', '_blank')
  }

  const handleExcelUpload = () => {
    console.log('ExcelUpload')
  }

  const handleDirectUpload = () => {
    navigate(ROUTER.LAWYER_ADMIN_CONTENT_VIDEO_EDIT)
  }

  return (
    <>
      <HeaderPortal>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>{lawyerBasicInfo?.lawyerName}변호사님이 등록한 영상입니다.</h1>
          <div className={styles.headerButtonWrapper}>
            <button type='button' onClick={handleExcelUpload}>
              영상 등록(Excel)
            </button>
            <button type='button' onClick={handleDirectUpload}>
              영상 등록(직접)
            </button>
          </div>
        </div>
      </HeaderPortal>
      <div className={styles['lawyer-video-detail']}>
        <DetailHeader title={data?.title || ''} className={styles['lawyer-video-detail-header']} />
        <div className={styles['lawyer-video-detail-player']}>
          <YoutubePlayer url={data?.source || ''} height={506} />
          <div className={styles['lawyer-video-detail-tags']}>
            {(data?.tags as unknown as Tag[])?.map((tag: Tag) => (
              <span key={tag.id}>#{tag.name}</span>
            ))}
          </div>
        </div>
        <VidoeInfo
          channelThumbnail={data?.channelThumbnail || ''}
          channelName={data?.channelName || ''}
          handleName={data?.handleName || ''}
          subscriberCount={data?.subscriberCount || 0}
          channelDescription={data?.channelDescription || ''}
          source={data?.source || ''}
        />
        <VideoSummary summary={data?.summaryContent || ''} className={styles['lawyer-video-detail-summary']} />

        {/* <VideoNavigationBar isKeep={isKeep} onSave={handleSave} onShare={handleShare} onVideoLink={handleVideoLink} /> */}
      </div>
    </>
  )
}

export default LawyerVideoDetail
