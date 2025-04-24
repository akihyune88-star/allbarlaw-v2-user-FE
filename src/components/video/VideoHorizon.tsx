import styles from '@/components/video/video-horizon.module.scss'
import SvgIcon from '../SvgIcon'

type VideoHorizonProps = {
  type?: 'default' | 'search' | 'reverse'
  size?: 'small' | 'large'
}

const VideoHorizon = ({ type = 'default', size = 'small' }: VideoHorizonProps) => {
  console.log(type, size)

  return (
    <div className={styles['video-horizon']}>
      <figure className={styles['video-horizon-figure']}>
        <img className={styles.img} src={'https://picsum.photos/200/300'} alt='동영상 썸네일' />
      </figure>
      <section className={styles['video-content-section']}>
        <header className={styles['video-content-section-header']}>
          <h1>주차장 음주운전, 잠깐의 방심으로 억울하게 처벌을 받을 위기 어떻개 해야하나요? 제발 살려주세요</h1>
          <SvgIcon name='bookMark' size={16} />
        </header>
        <p>
          음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 혈중알코올 농도가 0.03% 이상이면
          음주운전으로 간주되어 처벌대상이 됩니다. 음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수
          있습니다. 혈중알코올 농도가 0.03% 이상음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다.
          혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다. 음주후 주차장등에서 잠깐 운전하다가
          적발될 경우, 처벌받을 수 있습니다. 혈중알코올 농도가 0.03% 이상...
        </p>
        <div className={styles['video-content-section-footer']}>
          <span className={styles.lawyer}>양정하 변호사 [법률사무소 예성]</span>
          <figure className={styles['video-content-section-footer-figure']}>
            <img src='https://picsum.photos/200/300' alt='변호사 프로필 이미지' />
            <span className={styles.lawfirm}>형사전문변호사 리앤파트너스</span>
          </figure>
        </div>
      </section>
    </div>
  )
}

export default VideoHorizon
