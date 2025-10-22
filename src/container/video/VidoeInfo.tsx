import { useMediaQuery } from '@/hooks/useMediaQuery'
import { formatSubscriberCount } from '@/utils/youtubeUtils'
import styles from './vidoe-info.module.scss'

type VidoeInfoProps = {
  channelThumbnail: string
  channelName: string
  handleName: string
  subscriberCount: number
  channelDescription: string
  source: string
}

const VidoeInfo = ({
  channelThumbnail,
  channelName,
  handleName,
  subscriberCount,
  channelDescription,
  source,
}: VidoeInfoProps) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const handleChannelButton = () => {
    window.open(source, '_blank')
  }

  return (
    <section className={styles['container']}>
      {isMobile ? (
        <div className={styles['mobile-container']}>
          <header className={styles['info-header']}>
            <figure className={styles['channel-thumbnail']}>
              <img src={channelThumbnail} alt='유튜브채널썸네일' />
            </figure>
            <div>
              <h3 className={styles['channel-name']}>{channelName}</h3>
              <span>
                @{handleName}
                <span style={{ marginLeft: 18 }}>구독자 : {formatSubscriberCount(subscriberCount)}명</span>
              </span>
            </div>
          </header>
          <p className={styles['channel-description']}>{channelDescription}</p>
          <button className={styles['channel-footer-button']} onClick={handleChannelButton}>
            채널 바로가기
          </button>
        </div>
      ) : (
        <>
          <figure className={styles['channel-thumbnail']}>
            <img src={channelThumbnail} alt='유튜브채널썸네일' />
          </figure>
          <div className={styles['video-info']}>
            <header className={styles['info-header']}>
              <div>
                <h3 className={styles['channel-name']}>{channelName}</h3>
                <span>
                  {handleName}
                  <span style={{ marginLeft: 18 }}>구독자:{formatSubscriberCount(subscriberCount)}</span>
                </span>
              </div>
              <button className={styles['channel-button']} onClick={handleChannelButton}>
                채널 바로가기
              </button>
            </header>
            <p className={styles['channel-description']}>{channelDescription}</p>
          </div>
        </>
      )}
    </section>
  )
}

export default VidoeInfo
