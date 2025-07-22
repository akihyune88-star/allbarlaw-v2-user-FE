import SvgIcon from '../SvgIcon'
import styles from '@/components/legalKnowledgeItem/legal-knowledge-item.module.scss'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { COLOR } from '@/styles/color'
import { formatTimeAgo } from '@/utils/date'
import { useAuth } from '@/contexts/AuthContext'

type LegalKnowledgeItemProps = {
  title: string
  description: string
  time: Date
  isLastAnswer: boolean
  lawyerList?: {
    lawyerId: number
    lawyerProfileImage: string
    lawyerName: string
  }[]
  onClick?: () => void
  isShowKeep?: boolean
}

const LegalKnowledgeItem = ({
  title,
  description,
  time,
  isLastAnswer,
  lawyerList,
  onClick,
  isShowKeep = true,
}: LegalKnowledgeItemProps) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const { isLoggedIn } = useAuth()
  const formattedTime = time ? formatTimeAgo(time) : ''
  console.log(formattedTime)
  return (
    <article className={styles['legal-knowledge-item']} onClick={onClick}>
      <header className={styles['header']}>
        <h1>{title}</h1>
        <div className={styles['header-right']}>
          <span>
            <span className={styles['time']}>{formattedTime}</span> {isLastAnswer && '마지막 답변'}
          </span>
          {isLoggedIn && isShowKeep && <SvgIcon name='bookMark' />}
        </div>
      </header>
      <div className={styles['description-wrapper']}>
        <p className={styles['description']}>{description}</p>
      </div>
      <footer className={styles['footer']}>
        <div className={styles['footer-title']}>
          의뢰인이 선택한 변호사
          <SvgIcon
            name='checkRound'
            stroke={isMobile ? COLOR.green_01 : COLOR.icon_darkgreen}
            fill={COLOR.white}
            style={{ transform: 'translateY(-1px)' }}
          />
        </div>
        {lawyerList && (
          <div className={styles['lawyer-list']}>
            {lawyerList.map(lawyer => (
              <div className={styles['lawyer-item']} key={lawyer.lawyerId}>
                <img src={lawyer.lawyerProfileImage} alt={lawyer.lawyerName} />
                <span>{lawyer.lawyerName} 변호사</span>
              </div>
            ))}
          </div>
        )}
      </footer>
      {isMobile && (
        <div className={styles['header-right']}>
          <span>
            <span className={styles['time']}>{formattedTime}</span> {isLastAnswer && '마지막 답변'}
          </span>
          {isLoggedIn && isShowKeep && <SvgIcon name='bookMark' />}
        </div>
      )}
    </article>
  )
}

export default LegalKnowledgeItem
