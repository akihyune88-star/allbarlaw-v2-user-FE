import React from 'react'
import { formatTimeAgo } from '@/utils/date'
import styles from './chatList.module.scss'
import Divider from '@/components/divider/Divider'
import { COLOR } from '@/styles/color'

type LawyerChatItemProps = {
  name: string
  profileImage: string
  lastMessage: string
  lastMessageTime: string
  isOnline: boolean
}

const LawyerChatItem = ({ name, profileImage, lastMessage, lastMessageTime, isOnline }: LawyerChatItemProps) => {
  return (
    <div className={styles['lawyer-chat-item']}>
      <div className={styles['lawyer-chat-item-profile']}>
        <figure>
          <img src={profileImage} alt={name} />
        </figure>
      </div>
      <div className={styles['lawyer-chat-item-content']}>
        <div className={styles['lawyer-chat-item-content-name-badge-wrap']}>
          <div className={styles['lawyer-chat-item-content-name']}>{name} 변호사</div>
          <span
            className={styles['badge']}
            style={{ '--badge-color': isOnline ? COLOR.green_01 : 'rgba(0, 0, 0, 0.7)' } as React.CSSProperties}
          />
        </div>
        {/* <span /> */}
        <div className={styles['lawyer-chat-item-content-last-message-time']}>{formatTimeAgo(lastMessageTime)}</div>
        <div className={styles['lawyer-chat-item-content-last-message']}>{lastMessage}</div>
      </div>
    </div>
  )
}

const ChatList = () => {
  const lawyerChatList = [1, 2, 3, 4]
  return (
    <main className={styles['chat-list']}>
      <header className={styles['chat-list-header']}>
        <h3>바로톡 목록</h3>
        <div className={styles['chat-list-header-button']}>
          <span className={styles['chat-list-header-button-text']}>변호사와 1:1 상담을 진행할 수 있습니다.</span>
          <button>추가 상담하기</button>
        </div>
      </header>
      <section className={styles['chat-list-wrapper']}>
        <div className={styles['chat-list-content']}>
          {lawyerChatList.map((item, index) => (
            <>
              <LawyerChatItem
                key={index}
                name='김바로'
                profileImage='https://picsum.photos/200/300'
                lastMessage='안녕하세요,안녕하세요,안녕하세요,안녕하세요,안녕하세요,안녕하세요'
                lastMessageTime='2025-07-25 10:00'
                isOnline={false}
              />
              {index !== lawyerChatList.length - 1 && <Divider padding={0} />}
            </>
          ))}
        </div>
      </section>
    </main>
  )
}

export default ChatList
