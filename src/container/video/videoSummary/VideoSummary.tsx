import Divider from '@/components/divider/Divider'
import styles from './video-summary.module.scss'

type VideoSummaryProps = {
  summary: string
  className?: string
}

const VideoSummary = ({ summary, className }: VideoSummaryProps) => {
  return (
    <div className={`${styles['container']} ${className}`}>
      <header>
        <h3 className={styles['title']}>AI 영상 요약</h3>
      </header>
      <Divider padding={16} />
      <p className={styles['description']}>{summary}</p>
    </div>
  )
}

export default VideoSummary
