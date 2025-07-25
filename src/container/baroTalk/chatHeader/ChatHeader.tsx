import { Lawyer } from '@/types/lawyerTypes'
import styles from './chatHeader.module.scss'

interface ChatHeaderProps extends Lawyer {
  isActive: boolean
  count: {
    total: number
    month: number
  }
}

const ChatHeader = ({ id, name, lawfirm, profileImage, description, isActive = false, count }: ChatHeaderProps) => {
  return (
    <header className={styles['chat-header']}>
      <section className={styles['header-right']}>
        <figure>
          <img src={profileImage} alt={name} />
        </figure>
        <div className={styles['lawyer-info-text']}>
          <div className={styles['lawyer-name-badge-wrap']}>
            <span className={styles['lawyer-name']}>{name} 변호사</span>
            {isActive && <span className={styles['badge']} />}
          </div>
          <p className={styles['lawyer-lawfirm']}>{lawfirm}</p>
        </div>
        <button className={styles['lawyer-info-button']}>
          <span>변호사 정보</span>
        </button>
      </section>
      <section className={styles['header-left']}>
        <div className={styles['chat-info']}>
          <span className={styles['chat-info-title']}>채팅 상담</span>
          <span className={styles['chat-info-count']}>
            전체 {count.total.toLocaleString()}건&nbsp;&nbsp;&nbsp;한달이네 {count.month.toLocaleString()}건
          </span>
        </div>
        <button className={styles['chat-end-button']}>상담 끝내기</button>
      </section>
    </header>
  )
}

export default ChatHeader
