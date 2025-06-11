import VideoHorizon from '@/components/video/VideoHorizon'
import styles from './legal-term-list.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Fragment } from 'react/jsx-runtime'
import Divider from '@/components/divider/Divider'
import RecommenderVideo from '@/components/aiRecommender/RecommenderVideo'

const LegalTermVideoList = () => {
  const videoList = [1, 2, 3]
  const isMobile = useMediaQuery('(max-width: 80rem)')
  return (
    <div className={styles.container}>
      <header className={`${styles['list-header']} ${styles['video']}`}>
        <h3>법률영상</h3>
        <button>
          <span>더보기</span>
          <SvgIcon name='arrowSmall' style={{ transform: 'rotate(-90deg)' }} />
        </button>
      </header>
      {!isMobile && <Divider padding={24} />}
      <section className={styles['list-section']}>
        {videoList.map((video, index) =>
          isMobile ? (
            <RecommenderVideo
              key={video}
              videoUrl='https://picsum.photos/200/300'
              isShowTitle={false}
              description='음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 
              혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다. 
              음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 
              혈중알코올 농도가 0.03% 이상음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다. 
              '
            />
          ) : (
            <Fragment key={video}>
              <VideoHorizon />
              {index !== videoList.length - 1 && <Divider padding={24} />}
            </Fragment>
          )
        )}
      </section>
    </div>
  )
}

export default LegalTermVideoList
