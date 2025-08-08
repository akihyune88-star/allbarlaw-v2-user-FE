import VideoHorizon from '@/components/video/VideoHorizon'
import styles from './legal-term-list.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Fragment } from 'react/jsx-runtime'
import Divider from '@/components/divider/Divider'
import RecommenderVideo from '@/components/aiRecommender/RecommenderVideo'
import { VideoCase } from '@/types/videoTypes'
import EmptyState from '@/components/EmptyState/EmptyState'

const LegalTermVideoList = ({ videoList }: { videoList: VideoCase[] }) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  return (
    <div className={styles.container}>
      <header className={`${styles['list-header']} ${styles['video']}`}>
        <h3>법률영상</h3>
        {videoList.length > 0 && (
          <button>
            <span>더보기</span>
            <SvgIcon name='arrowSmall' style={{ transform: 'rotate(-90deg)' }} />
          </button>
        )}
      </header>
      {!isMobile && videoList.length > 0 && <Divider padding={24} />}
      <section className={styles['list-section']}>
        {videoList.length === 0 ? (
          <EmptyState message='등록된 법률 영상이 없습니다.' />
        ) : (
          videoList.map((video, index) =>
            isMobile ? (
              <RecommenderVideo
                key={video.videoCaseId}
                videoUrl={video.thumbnail}
                isShowTitle={false}
                description={video.summaryContent}
              />
            ) : (
              <Fragment key={video.videoCaseId}>
                <VideoHorizon
                  size='small'
                  thumbnailUrl={video.thumbnail}
                  title={video.title}
                  summaryContents={video.summaryContent}
                />
                {index !== videoList.length - 1 && <Divider padding={24} />}
              </Fragment>
            )
          )
        )}
      </section>
    </div>
  )
}

export default LegalTermVideoList
