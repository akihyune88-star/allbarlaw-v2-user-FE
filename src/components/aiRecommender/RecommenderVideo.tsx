import SvgIcon from '../SvgIcon'
import styles from './recommender-video.module.scss'

type RecommenderVideoProps = {
  videoUrl: string
  isShowTitle?: boolean
  title?: string
  description?: string
  isShowKeepBookmark?: boolean
}

const RecommenderVideo = ({
  videoUrl,
  isShowTitle = true,
  title,
  description,
  isShowKeepBookmark,
}: RecommenderVideoProps) => {
  return (
    <section className={styles.container}>
      {isShowTitle && (
        <header>
          <span>{title}</span>
        </header>
      )}
      <div className={styles['content']}>
        <figure>
          <img src={videoUrl} alt='recommender-video' className={styles.thumbnail} />
        </figure>
        <div className={styles.description}>{description}</div>
        {isShowKeepBookmark && <SvgIcon name='bookMark' style={{ flexShrink: 0 }} size={16} />}
      </div>
    </section>
  )
}

export default RecommenderVideo
