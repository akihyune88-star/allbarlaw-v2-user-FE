import styles from './video-summary.module.scss'
import SvgIcon from '@/components/SvgIcon'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

type VideoSummaryProps = {
  summary: string
  lawyerName?: string
  className?: string
}

const markdownComponents: Components = {
  ul: ({ children }) => <ul className={styles['list']}>{children}</ul>,
  li: ({ children }) => (
    <li className={styles['summary-item']}>
      <SvgIcon name='aiCheck' size={16} className={styles['summary-item-icon']} />
      <span className={styles['summary-item-text']}>{children}</span>
    </li>
  ),
  p: ({ children }) => <p className={styles['summary']}>{children}</p>,
}

const VideoSummary = ({ summary, lawyerName, className }: VideoSummaryProps) => {
  return (
    <div className={`${styles['container']} ${className || ''}`}>
      <h2 className={styles['summary-title']}>
        <SvgIcon name='aiBubble' size={18} />
        AI 영상 요약
      </h2>
      {lawyerName && (
        <p className={styles['summary-description']}>{lawyerName} 변호사의 영상을 AI가 요약한 결과입니다.</p>
      )}
      <hr className={styles['line-divider']} />
      <ReactMarkdown components={markdownComponents}>{summary}</ReactMarkdown>
      <hr className={styles['line-divider']} style={{ marginTop: '34px' }} />
      <span className={styles['summary-warning']}>
        본 요약은 AI를 활용해 생성된 것으로, 일부 정보가 부정확하거나 완전하지 않을 수 있습니다. 필요 시 원문을 참고해
        주세요.
      </span>
    </div>
  )
}

export default VideoSummary
