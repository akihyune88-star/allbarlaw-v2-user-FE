import styles from './chatHeader.module.scss'

interface ChatHeaderProps {
  isActive: boolean
  count: {
    total: number
    month: number
  }
  className?: string
  onEndChat?: () => void
  isLawyer: boolean
  // 변호사 정보 (유저가 볼 때)
  lawfirmName?: string
  lawyerName?: string
  lawyerProfileImage?: string
  // 유저 정보 (변호사가 볼 때)
  userId?: number
  userName?: string
}

const ChatHeader = ({
  lawfirmName,
  lawyerName,
  lawyerProfileImage,
  isActive = false,
  count,
  className,
  onEndChat,
  isLawyer,
  userId,
  userName,
}: ChatHeaderProps) => {
  const handleEndChat = () => {
    if (onEndChat) {
      onEndChat()
    }
  }

  return (
    <header className={`${styles['chat-header']} ${className}`}>
      <section className={styles['header-right']}>
        {!isLawyer ? (
          // 유저가 보는 화면 - 변호사 정보 표시
          <>
            <figure>
              <img src={lawyerProfileImage} alt={lawyerName} />
            </figure>
            <div className={styles['lawyer-info-text']}>
              <div className={styles['lawyer-name-badge-wrap']}>
                <span className={styles['lawyer-name']}>{lawyerName} 변호사</span>
                {isActive && <span className={styles['badge']} />}
              </div>
              <p className={styles['lawyer-lawfirm']}>{lawfirmName}</p>
            </div>
            <button className={styles['lawyer-info-button']}>
              <span>변호사 정보</span>
            </button>
          </>
        ) : (
          // 변호사가 보는 화면 - 유저 정보 표시
          <>
            {/* <figure>
              <img src='https://picsum.photos/200/300' alt={userName || `사용자 ${userId}`} />
            </figure> */}
            <div className={styles['lawyer-info-text']}>
              <div className={styles['lawyer-name-badge-wrap']}>
                <span className={styles['lawyer-name']}>{userName ? `${userName} 님` : `사용자 ${userId}`}</span>
                {isActive && <span className={styles['badge']} />}
              </div>
              {/* <p className={styles['lawyer-lawfirm']}>상담 의뢰자</p> */}
            </div>
          </>
        )}
      </section>
      <section className={styles['header-left']}>
        {!isLawyer && (
          <div className={styles['chat-info']}>
            <span className={styles['chat-info-title']}>채팅 상담</span>
            <span className={styles['chat-info-count']}>
              전체 {count.total.toLocaleString()}건&nbsp;&nbsp;&nbsp;한달이네 {count.month.toLocaleString()}건
            </span>
          </div>
        )}
        <button className={styles['chat-end-button']} onClick={handleEndChat}>
          상담 끝내기
        </button>
      </section>
    </header>
  )
}

export default ChatHeader
