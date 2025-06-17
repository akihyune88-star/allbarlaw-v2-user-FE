import Card from '@/components/card'
import Button from '@/components/button/Button'
import SvgIcon from '@/components/SvgIcon'
import Divider from '@/components/divider/Divider'
import styles from './consultation-content-card.module.scss'
import ReactMarkdown from 'react-markdown'
import { markdownComponents } from '@/utils/markdownComponents'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface ConsultationContentCardProps {
  title?: string
  content?: string
  lastAnswerTime?: string
  onShare?: () => void
  onSave?: () => void
  isSaved?: boolean
  className?: string
  tags?: string[]
}

const ConsultationContentCard = ({
  title = '상담 내용',
  content,
  lastAnswerTime = '3시간전',
  tags,
  onShare,
  onSave,
  isSaved = false,
  className,
}: ConsultationContentCardProps) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')

  const handleShare = () => {
    if (onShare) {
      onShare()
    } else {
      console.log('공유하기')
    }
  }

  const handleSave = () => {
    if (onSave) {
      onSave()
    } else {
      console.log('저장하기')
    }
  }

  return (
    <div className={styles['consultation-content-card']}>
      <Card className={`${styles['card-container']} ${className || ''}`} shadow={false} border={false}>
        <Card.Header className={styles['card-header']}>
          <h4>{title}</h4>
          <div className={styles['card-header-meta']}>
            <span className={styles['last-answer-time']}>
              <strong>{lastAnswerTime}</strong> 마지막 답변
            </span>
            <Button variant='share' onClick={handleShare}>
              공유
              <SvgIcon name='share' size={16} />
            </Button>
            <Button variant='save' onClick={handleSave}>
              저장 <SvgIcon name={isSaved ? 'bookMarkStrong' : 'save'} size={16} />
            </Button>
          </div>
        </Card.Header>
        <Divider padding={16} />
        <Card.Content className={styles['card-content']}>
          <ReactMarkdown components={markdownComponents}>{content || '내용이 없습니다.'}</ReactMarkdown>
        </Card.Content>
      </Card>
      <div className={styles['tag-list']}>
        {tags?.map(tag => (
          <div className={styles['tag-item']}>
            <span className={styles['tag-item-text']}>#{tag}</span>
          </div>
        ))}
      </div>
      {isMobile && (
        <span className={styles['last-answer-time']}>
          <strong>{lastAnswerTime}</strong> 마지막 답변
        </span>
      )}
    </div>
  )
}

export default ConsultationContentCard
