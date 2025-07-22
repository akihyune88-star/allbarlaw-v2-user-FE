import { useAuth } from '@/contexts/AuthContext'
import SvgIcon from '../SvgIcon'
import styles from './recommender-video.module.scss'

type RecommenderVideoProps = {
  videoUrl: string
  isShowTitle?: boolean
  title?: string
  description?: string
}

const RecommenderVideo = ({ videoUrl, isShowTitle = true, title, description }: RecommenderVideoProps) => {
  const { isLoggedIn } = useAuth()
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
        {isLoggedIn && <SvgIcon name='bookMark' style={{ flexShrink: 0 }} size={16} />}
      </div>
    </section>
  )
}

export default RecommenderVideo
