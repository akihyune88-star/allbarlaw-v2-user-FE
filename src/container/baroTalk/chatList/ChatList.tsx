import React, { useMemo } from 'react'
import { formatTimeAgo } from '@/utils/date'
import styles from './chatList.module.scss'
import Divider from '@/components/divider/Divider'
import { COLOR } from '@/styles/color'
import { useGetBaroTalkChatList } from '@/hooks/queries/useBaroTalk'
import { ChatRoom } from '@/types/baroTalkTypes'
import { ROUTER } from '@/routes/routerConstant'
import { useNavigate } from 'react-router-dom'

type LawyerChatItemProps = {
  name: string
  profileImage: string
  lastMessage: string
  lastMessageTime: string
  isOnline: boolean
}

type ChatListItemProps = {
  onChatRoomClick: (chatRoomId: number) => void
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
        <div className={styles['lawyer-chat-item-content-last-message-time']}>{formatTimeAgo(lastMessageTime)}</div>
        <div className={styles['lawyer-chat-item-content-last-message']}>{lastMessage}</div>
      </div>
    </div>
  )
}

const ChatList = ({ onChatRoomClick }: ChatListItemProps) => {
  // 채팅방 리스트 데이터 불러오기
  const {
    data: chatPages,
    isLoading,
    error,
  } = useGetBaroTalkChatList({
    chatRoomOrderBy: 'lastMessageAt',
    chatRoomSort: 'desc',
  })

  const navigate = useNavigate()
  // 모든 채팅방 데이터를 하나의 배열로 합치기
  const allChatRooms = useMemo(() => {
    if (!chatPages) return []
    return chatPages.pages.flatMap(page => page.chatRooms)
  }, [chatPages])

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <main className={styles['chat-list']}>
        <div>채팅방 목록을 불러오는 중...</div>
      </main>
    )
  }

  // 에러 상태 처리
  if (error) {
    return (
      <main className={styles['chat-list']}>
        <div>채팅방 목록을 불러오는데 실패했습니다.</div>
      </main>
    )
  }

  const handleAddConsultation = () => {
    navigate(ROUTER.REQUEST_BARO_TALK)
  }

  return (
    <main className={styles['chat-list']}>
      <header className={styles['chat-list-header']}>
        <h3>바로톡 목록</h3>
        <div className={styles['chat-list-header-button']}>
          <span className={styles['chat-list-header-button-text']}>변호사와 1:1 상담을 진행할 수 있습니다.</span>
          <button onClick={handleAddConsultation}>추가 상담하기</button>
        </div>
      </header>
      <section className={styles['chat-list-wrapper']}>
        <div className={styles['chat-list-content']}>
          {allChatRooms.length === 0 ? (
            <div className={styles['empty-state']}>
              <p>아직 상담 중인 채팅방이 없습니다.</p>
              <p>새로운 상담을 시작해보세요!</p>
            </div>
          ) : (
            allChatRooms.map((chatRoom: ChatRoom, index: number) => (
              <div key={chatRoom.chatRoomId} onClick={() => onChatRoomClick(chatRoom.chatRoomId)}>
                <LawyerChatItem
                  name={chatRoom.chatRoomLawyer.lawyerName}
                  profileImage={chatRoom.chatRoomLawyer.lawyerProfileImage}
                  lastMessage={chatRoom.chatRoomLastMessage.chatMessageContent}
                  lastMessageTime={chatRoom.chatRoomLastMessage.chatMessageCreatedAt}
                  isOnline={chatRoom.chatRoomIsActive}
                />
                {index !== allChatRooms.length - 1 && <Divider padding={0} />}
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  )
}

export default ChatList
