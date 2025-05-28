import styles from './video-thumbnail.module.scss'

type VideoThumbnailProps = {
  size: 'small' | 'large'
  imgUrl?: string
  title?: string
  description?: string
}

const VideoThumbnail = ({ size = 'small', imgUrl, title, description }: VideoThumbnailProps) => {
  return (
    <div className={`${styles.container} ${styles[size]}`}>
      <figure>
        <img src={imgUrl} alt={title} className={styles.image} />
      </figure>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  )
}

export default VideoThumbnail
