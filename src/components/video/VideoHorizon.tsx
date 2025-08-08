import styles from '@/components/video/video-horizon.module.scss'
import SvgIcon from '../SvgIcon'
import { useState } from 'react'
import { COLOR } from '@/styles/color'
import { useAuth } from '@/contexts/AuthContext'
import { useVideoKeep } from '@/hooks/queries/useGetVideoList'

type VideoHorizonProps = {
  type?: 'default' | 'search' | 'reverse'
  size?: 'xsmall' | 'small' | 'regular' | 'large'
  title?: string
  thumbnailUrl?: string
  isKeep?: boolean
  lawyerName?: string
  lawfirmName?: string
  channelName?: string
  channelThumbnail?: string
  className?: string
  summaryContents?: string
  onClick?: () => void
  videoCaseId?: number
}

const VideoHorizon = ({
  type = 'default',
  size = 'regular',
  thumbnailUrl,
  title,
  lawyerName,
  lawfirmName,
  channelName,
  channelThumbnail,
  className,
  summaryContents,
  isKeep,
  onClick,
  videoCaseId,
}: VideoHorizonProps) => {
  const [like, setLike] = useState(isKeep)
  const { isLoggedIn } = useAuth()

  const { mutate: changeVideoKeep } = useVideoKeep({
    onSuccess: data => {
      setLike(data.isKeep)
    },
    onError: () => {
      setLike(prevState => !prevState)
    },
  })

  const handleVideoKeep = () => {
    if (isLoggedIn && videoCaseId) {
      changeVideoKeep(videoCaseId)
    }
  }

  const rootClassName = [styles['video-horizon'], styles[type], styles[size]].filter(Boolean).join(' ')

  return (
    <div className={`${rootClassName} ${className}`} onClick={onClick}>
      <figure className={styles['video-horizon-figure']}>
        <img className={styles.img} src={thumbnailUrl} alt='동영상 썸네일' />
      </figure>
      <section className={styles['video-content-section']}>
        <header className={styles['video-content-section-header']}>
          <h1>{title}</h1>
          {isLoggedIn && (
            <button className={styles['bookmark-icon']} onClick={handleVideoKeep}>
              <SvgIcon name='bookMark' size={16} onClick={() => setLike(!like)} fill={like ? COLOR.green_01 : 'none'} />
            </button>
          )}
        </header>
        <p>{summaryContents}</p>
        {lawyerName && (
          <div className={styles['video-content-section-footer']}>
            <span className={styles.lawyer}>
              {lawyerName} 변호사 [{lawfirmName}]
            </span>
            <figure className={styles['video-content-section-footer-figure']}>
              <img src={channelThumbnail} alt='유튜브 채널 이미지' />
              <span className={styles.lawfirm}>{channelName}</span>
            </figure>
          </div>
        )}
      </section>
    </div>
  )
}

export default VideoHorizon
