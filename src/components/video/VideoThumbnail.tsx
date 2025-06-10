import styles from './video-thumbnail.module.scss'

type VideoThumbnailProps = {
  size: 'small' | 'large' | 'text'
  imgUrl?: string
  title?: string
  lawyerName?: string
  description?: string
}

const VideoThumbnail = ({ size = 'small', imgUrl, title, description, lawyerName }: VideoThumbnailProps) => {
  return (
    <div className={`${styles.container} ${styles[size]}`}>
      <figure>
        <img src={imgUrl} alt={title} className={styles.image} />
      </figure>
      <div className={styles.content}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {lawyerName && <p className={styles['lawyer-name']}>{lawyerName}</p>}
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  )
}

export default VideoThumbnail
