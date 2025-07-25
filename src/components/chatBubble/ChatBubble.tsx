import React from 'react'
import styles from './ChatBubble.module.scss'

interface ChatBubbleProps {
  message: string
  color?: string
  direction?: 'left' | 'right'
  children?: React.ReactNode
}

const ChatBubble = ({ message, color = '#22c55e', direction = 'left', children }: ChatBubbleProps) => {
  return (
    <div className={`${styles.bubbleWrap} ${styles[direction]}`}>
      <div className={styles.bubbleRow}>
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
        <div className={styles.bubble} style={{ backgroundColor: color }}>
          {message}
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
      </div>
      {children && <div className={styles.meta}>{children}</div>}
    </div>
  )
}

export default ChatBubble
