import styles from './recommender-video.module.scss'

type RecommenderVideoProps = {
  videoUrl: string
  isShowTitle?: boolean
  title?: string
  description?: string
}

const RecommenderVideo = ({ videoUrl, isShowTitle = true, title, description }: RecommenderVideoProps) => {
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
      </div>
    </section>
  )
}

export default RecommenderVideo
