import styles from '@/components/video/video-horizon.module.scss'
import SvgIcon from '../SvgIcon'
import { useState } from 'react'
import { COLOR } from '@/styles/color'

type VideoHorizonProps = {
  type?: 'default' | 'search' | 'reverse'
  size?: 'xsmall' | 'small' | 'large'
  title?: string
  thumbnailUrl?: string
  lawyerName?: string
  lawfirmName?: string
  channelName?: string
  channelThumbnail?: string
  isShowLike?: boolean
  onClick?: () => void
}

const VideoHorizon = ({
  type = 'default',
  size = 'small',
  thumbnailUrl,
  title,
  lawyerName,
  lawfirmName,
  channelName,
  channelThumbnail,
  isShowLike = false,
  onClick,
}: VideoHorizonProps) => {
  const [like, setLike] = useState(false)

  const rootClassName = [styles['video-horizon'], styles[type], styles[size]].filter(Boolean).join(' ')

  return (
    <div className={rootClassName} onClick={onClick}>
      <figure className={styles['video-horizon-figure']}>
        <img className={styles.img} src={thumbnailUrl} alt='동영상 썸네일' />
      </figure>
      <section className={styles['video-content-section']}>
        <header className={styles['video-content-section-header']}>
          <h1>{title}</h1>
          {isShowLike && (
            <div className={styles['bookmark-icon']}>
              <SvgIcon name='bookMark' size={16} onClick={() => setLike(!like)} fill={like ? COLOR.green_01 : 'none'} />
            </div>
          )}
        </header>
        <p>
          음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 혈중알코올 농도가 0.03% 이상이면
          음주운전으로 간주되어 처벌대상이 됩니다. 음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수
          있습니다. 혈중알코올 농도가 0.03% 이상음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다.
          혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다. 음주후 주차장등에서 잠깐 운전하다가
          적발될 경우, 처벌받을 수 있습니다. 혈중알코올 농도가 0.03% 이상...
        </p>
        <div className={styles['video-content-section-footer']}>
          <span className={styles.lawyer}>
            {lawyerName} 변호사 [{lawfirmName}]
          </span>
          <figure className={styles['video-content-section-footer-figure']}>
            <img src={channelThumbnail} alt='유튜브 채널 이미지' />
            <span className={styles.lawfirm}>{channelName}</span>
          </figure>
        </div>
      </section>
    </div>
  )
}

export default VideoHorizon
