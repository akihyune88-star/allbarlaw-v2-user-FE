import React from 'react'
import styles from './ChatBubble.module.scss'

interface ChatBubbleProps {
  message: string
  color?: string
  colorText?: string
  direction?: 'left' | 'right'
  maxWidth?: string | number
  profileImage?: string
  children?: React.ReactNode
  // 읽음 상태 관련
  isRead?: boolean
  showReadStatus?: boolean
  // 메시지 전송 상태
  status?: 'sending' | 'sent' | 'failed'
}

const ChatBubble = ({
  message,
  color = '#22c55e',
  colorText = '#fff',
  direction = 'left',
  maxWidth = '80vw',
  profileImage,
  children,
  isRead = false,
  showReadStatus = false,
  status = 'sent',
}: ChatBubbleProps) => {
  // 상태 아이콘 표시 함수
  const renderStatusIcon = () => {
    if (direction === 'left' || !showReadStatus) return null
    
    switch (status) {
      case 'sending':
        return (
          <span className={styles.statusIcon} title="전송 중...">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="2">
                <animate attributeName="r" values="2;6;2" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
              </circle>
            </svg>
          </span>
        )
      case 'sent':
        return (
          <span className={`${styles.statusIcon} ${isRead ? styles.read : styles.delivered}`} title={isRead ? "읽음" : "전송됨"}>
            {isRead ? (
              // 읽음 (파란색 체크)
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#2563eb">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
              </svg>
            ) : (
              // 전송됨 (회색 체크)
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#9ca3af">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
              </svg>
            )}
          </span>
        )
      case 'failed':
        return (
          <span className={`${styles.statusIcon} ${styles.failed}`} title="전송 실패">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#ef4444">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className={`${styles.bubbleWrap} ${styles[direction]}`}>
      <div className={styles.bubbleRow} style={{ position: 'relative' }}>
        {direction === 'left' && profileImage && <img src={profileImage} alt='profile' className={styles.profileImg} />}
        {direction === 'left' && (
          <svg
            className={styles.tailSvg}
            width='13'
            height='16'
            viewBox='0 0 13 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            style={{ color }}
          >
            <path
              d='M0.0439453 0H12.0439C10.8132 0 7.61318 0.8 4.65933 4C1.70548 7.2 0.351638 13.3333 0.0439453 16V0Z'
              fill='currentColor'
            />
          </svg>
        )}
        <div className={styles.bubble} style={{ backgroundColor: color, color: colorText, maxWidth }}>
          {message}
          {children && (
            <div className={styles.meta}>
              {children}
              {renderStatusIcon()}
            </div>
          )}
          {!children && renderStatusIcon() && (
            <div className={styles.meta}>
              {renderStatusIcon()}
            </div>
          )}
        </div>
        {direction === 'right' && (
          <svg
            className={styles.tailSvg}
            width='13'
            height='16'
            viewBox='0 0 13 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            style={{ color }}
          >
            <path
              d='M0.0439453 0H12.0439C10.8132 0 7.61318 0.8 4.65933 4C1.70548 7.2 0.351638 13.3333 0.0439453 16V0Z'
              fill='currentColor'
            />
          </svg>
        )}
        {direction === 'right' && profileImage && (
          <img src={profileImage} alt='profile' className={styles.profileImg} />
        )}
      </div>
    </div>
  )
}

export default ChatBubble
