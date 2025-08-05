import styles from '@/components/video/video-horizon.module.scss'
import SvgIcon from '../SvgIcon'
import { useState } from 'react'
import { COLOR } from '@/styles/color'
import { useAuth } from '@/contexts/AuthContext'

type VideoHorizonProps = {
  type?: 'default' | 'search' | 'reverse'
  size?: 'xsmall' | 'small' | 'regular' | 'large'
  title?: string
  thumbnailUrl?: string
  lawyerName?: string
  lawfirmName?: string
  channelName?: string
  channelThumbnail?: string
  className?: string
  summaryContents?: string
  onClick?: () => void
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
  onClick,
}: VideoHorizonProps) => {
  const [like, setLike] = useState(false)
  const { isLoggedIn } = useAuth()

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
            <div className={styles['bookmark-icon']}>
              <SvgIcon name='bookMark' size={16} onClick={() => setLike(!like)} fill={like ? COLOR.green_01 : 'none'} />
            </div>
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
