import styles from './chatHeader.module.scss'
import SvgIcon from '@/components/SvgIcon'

interface ChatHeaderProps {
  isActive: boolean
  count: {
    total: number
    month: number
  }
  className?: string
  onEndChat?: () => void
  onBack?: () => void
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
  // lawfirmName,
  lawyerName,
  // lawyerProfileImage,
  isActive = false,
  count,
  className,
  onEndChat,
  onBack,
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
      {/* 뒤로가기 버튼 */}
      {onBack && (
        <button 
          className={styles['back-button']} 
          onClick={onBack}
          aria-label='뒤로가기'
        >
          <SvgIcon name='arrowSmall' size={24} />
        </button>
      )}
      
      {/* 중앙: 변호사/유저 정보 */}
      <div className={styles['header-center']}>
        {!isLawyer ? (
          // 유저가 보는 화면 - 변호사 정보 표시
          <div className={styles['lawyer-name-badge-wrap']}>
            <span className={styles['lawyer-name']}>{lawyerName} 변호사</span>
            {isActive && <span className={styles['badge']} />}
          </div>
        ) : (
          // 변호사가 보는 화면 - 유저 정보 표시
          <div className={styles['lawyer-name-badge-wrap']}>
            <span className={styles['lawyer-name']}>{userName ? `${userName} 님` : `사용자 ${userId}`}</span>
            {isActive && <span className={styles['badge']} />}
          </div>
        )}
      </div>
      
      {/* 오른쪽: 정보 버튼 (모바일) / 기존 섹션 (데스크탑) */}
      <div className={styles['header-actions']}>
        {!isLawyer && (
          <button className={styles['info-button-mobile']} aria-label='변호사 정보'>
            <SvgIcon name='menu' size={20} />
          </button>
        )}
      </div>
      
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
