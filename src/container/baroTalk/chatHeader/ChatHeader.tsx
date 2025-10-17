import styles from './chatHeader.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { ROUTER } from '@/routes/routerConstant'
import { COLOR } from '@/styles/color'

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
  lawyerId?: number
  // 유저 정보 (변호사가 볼 때)
  userId?: number
  userName?: string
}

const ChatHeader = ({
  // lawfirmName,
  lawyerName,
  lawyerProfileImage,
  lawyerId,
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

  const handleLawyerInfo = () => {
    if (lawyerId) {
      // 새 창으로 변호사 상세 페이지 열기
      const lawyerDetailUrl = `${window.location.origin}${ROUTER.SEARCH_MAIN}/lawyer/${lawyerId}`
      window.open(lawyerDetailUrl, '_blank', 'width=1300,height=800,scrollbars=yes')
    }
  }

  // 온라인 상태에 따른 배지 색상
  const getBadgeColor = (isOnline: boolean) => {
    return isOnline ? COLOR.green_01 : 'rgba(0, 0, 0, 0.7)'
  }

  return (
    <header className={`${styles['chat-header']} ${className}`}>
      {/* 모바일용 뒤로가기 버튼 */}
      {onBack && (
        <button className={styles['back-button']} onClick={onBack} aria-label='뒤로가기'>
          <SvgIcon name='arrowSmall' size={24} style={{ transform: 'rotate(45deg)' }} />
        </button>
      )}

      {/* 모바일용 중앙: 변호사/유저 정보 */}
      <div className={styles['header-center']}>
        {!isLawyer ? (
          // 유저가 보는 화면 - 변호사 정보 표시
          <div className={styles['lawyer-name-badge-wrap']}>
            <span className={styles['lawyer-name']}>{lawyerName} 변호사</span>
            <span
              className={styles['badge']}
              style={{
                backgroundColor: getBadgeColor(isActive),
              }}
            />
          </div>
        ) : (
          // 변호사가 보는 화면 - 유저 정보 표시
          <div className={styles['lawyer-name-badge-wrap']}>
            <span className={styles['lawyer-name']}>{userName ? `${userName} 님` : `사용자 ${userId}`}</span>
            <span
              className={styles['badge']}
              style={{
                backgroundColor: getBadgeColor(isActive),
              }}
            />
          </div>
        )}
      </div>

      {/* 모바일용 오른쪽: 변호사 정보 버튼 */}
      <div className={styles['header-actions']}>
        {!isLawyer && (
          <button className={styles['lawyer-info-button-mobile']} onClick={handleLawyerInfo}>
            변호사 정보
          </button>
        )}
      </div>

      {/* PC용 왼쪽 섹션 */}
      <section className={styles['header-left']}>
        {/* PC용 변호사/유저 정보 */}
        <div className={styles['header-user-info']}>
          {!isLawyer ? (
            // 유저가 보는 화면 - 변호사 정보 표시
            <>
              {lawyerProfileImage && (
                <img src={lawyerProfileImage} alt={`${lawyerName} 변호사`} className={styles['profile-image']} />
              )}
              <div className={styles['lawyer-name-badge-wrap']}>
                <span className={styles['lawyer-name']}>{lawyerName} 변호사</span>
                <span
                  className={styles['badge']}
                  style={{
                    backgroundColor: getBadgeColor(isActive),
                  }}
                />
              </div>
            </>
          ) : (
            // 변호사가 보는 화면 - 유저 정보 표시
            <div className={styles['lawyer-name-badge-wrap']}>
              <span className={styles['lawyer-name']}>{userName ? `${userName} 님` : `사용자 ${userId}`}</span>
              <span
                className={styles['badge']}
                style={{
                  backgroundColor: getBadgeColor(isActive),
                }}
              />
            </div>
          )}
        </div>
        {/* 변호사 정보 버튼 - 이름 오른쪽에 배치 */}
        {!isLawyer && (
          <button className={styles['lawyer-info-button']} onClick={handleLawyerInfo}>
            변호사 정보
          </button>
        )}
      </section>

      {/* PC용 오른쪽 섹션 */}
      <section className={styles['header-right']}>
        {!isLawyer && (
          <div className={styles['chat-info']}>
            <span className={styles['chat-info-title']}>채팅 상담</span>
            <span className={styles['chat-info-count']}>
              전체 {count.total.toLocaleString()}건&nbsp;&nbsp;&nbsp;한달이네 {count.month.toLocaleString()}건
            </span>
          </div>
        )}
        <button className={styles['chat-end-button']} onClick={handleEndChat}>
          신고 하기
        </button>
      </section>
    </header>
  )
}

export default ChatHeader
