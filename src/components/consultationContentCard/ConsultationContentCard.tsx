import Card from '@/components/card'
import Button from '@/components/button/Button'
import SvgIcon from '@/components/SvgIcon'
import Divider from '@/components/divider/Divider'
import styles from './consultation-content-card.module.scss'
import ReactMarkdown from 'react-markdown'
import { markdownComponents } from '@/utils/markdownComponents'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { COLOR } from '@/styles/color'
import { Tag } from '@/types/lawyerTypes'

interface ConsultationContentCardProps {
  title?: string
  content?: string
  lastAnswerTime?: string
  onShare?: () => void
  onSave?: () => void
  isSaved?: boolean
  className?: string
  tags?: Tag[]
  isKeep?: boolean
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
  isKeep,
}: ConsultationContentCardProps) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')

  return (
    <div className={styles['consultation-content-card']}>
      <Card className={`${styles['card-container']} ${className || ''}`} shadow={false} border={false}>
        <Card.Header className={styles['card-header']}>
          <h4>{title}</h4>
          <div className={styles['card-header-meta']}>
            <span className={styles['last-answer-time']}>
              <strong>{lastAnswerTime}</strong> 마지막 답변
            </span>
            <Button variant='share' onClick={onShare}>
              공유
              <SvgIcon name='share' size={16} />
            </Button>
            <Button variant='save' onClick={onSave}>
              저장
              <SvgIcon name={isSaved ? 'bookMarkStrong' : 'save'} size={16} fill={isKeep ? COLOR.green_01 : 'none'} />
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
          <div className={styles['tag-item']} key={tag.id}>
            <span className={styles['tag-item-text']}>#{tag.name}</span>
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
