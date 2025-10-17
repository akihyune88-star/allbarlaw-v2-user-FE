import React, { useEffect } from 'react'
import { formatTimeAgo } from '@/utils/date'
import styles from './chatList.module.scss'
import Divider from '@/components/divider/Divider'
import { COLOR } from '@/styles/color'
import { useGetBaroTalkChatList } from '@/hooks/queries/useBaroTalk'
import { ChatRoom } from '@/types/baroTalkTypes'
import { ROUTER } from '@/routes/routerConstant'
import { useNavigate } from 'react-router-dom'
import { useChatRooms, useSetChatRooms } from '@/stores/socketStore'

type LawyerChatItemProps = {
  name: string
  profileImage: string
  lastMessage: string
  lastMessageTime: string
  partnerOnlineStatus?: 'online' | 'offline' | 'away'
}

const LawyerChatItem = ({
  name,
  profileImage,
  lastMessage,
  lastMessageTime,
  partnerOnlineStatus = 'offline',
}: LawyerChatItemProps) => {
  const getStatusColor = (status: 'online' | 'offline' | 'away') => {
    switch (status) {
      case 'online':
        return COLOR.green_01
      case 'away':
        return '#ffff00' // 노란색
      case 'offline':
      default:
        return 'rgba(0, 0, 0, 0.7)'
    }
  }

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
            style={
              {
                '--badge-color': getStatusColor(partnerOnlineStatus),
                backgroundColor: getStatusColor(partnerOnlineStatus), // 직접 배경색도 설정
              } as React.CSSProperties
            }
          />
        </div>
        <div className={styles['lawyer-chat-item-content-last-message-time']}>{formatTimeAgo(lastMessageTime)}</div>
        <div className={styles['lawyer-chat-item-content-last-message']}>{lastMessage}</div>
      </div>
    </div>
  )
}

type ChatListProps = {
  _chatRoomId?: number
  onChatRoomClick: (_chatRoomId: number) => void
}

const ChatList = ({ onChatRoomClick }: ChatListProps) => {
  const navigate = useNavigate()

  // Zustand 상태 및 액션
  const chatRooms = useChatRooms()
  const setChatRooms = useSetChatRooms()

  // React Query로 초기 데이터만 로드
  const {
    data: chatPages,
    isLoading,
    error,
  } = useGetBaroTalkChatList({
    chatRoomOrderBy: 'lastMessageAt',
    chatRoomSort: 'desc',
  })

  // React Query 데이터를 Zustand에 동기화
  useEffect(() => {
    if (chatPages && chatPages.pages.length > 0) {
      const firstPage = chatPages.pages[0]
      const allRooms = chatPages.pages.flatMap(page => page.chatRooms)

      console.log('🔍 [ChatList] React Query 데이터를 Zustand에 저장:', {
        roomCount: allRooms.length,
        total: firstPage.total,
      })

      setChatRooms(allRooms, firstPage.total, firstPage.page, firstPage.totalPages)
    }
  }, [chatPages, setChatRooms])

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
          {chatRooms.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>채팅방이 없습니다</div>
          ) : (
            chatRooms.map((chatRoom: ChatRoom, index: number) => {
              return (
                <div key={chatRoom.chatRoomId} onClick={() => onChatRoomClick(chatRoom.chatRoomId)}>
                  <LawyerChatItem
                    name={chatRoom.chatRoomLawyer.lawyerName}
                    profileImage={chatRoom.chatRoomLawyer.lawyerProfileImage}
                    lastMessage={chatRoom.chatRoomLastMessage.chatMessageContent}
                    lastMessageTime={chatRoom.chatRoomLastMessage.chatMessageCreatedAt}
                    partnerOnlineStatus={chatRoom.partnerOnlineStatus || 'offline'}
                  />
                  {index !== chatRooms.length - 1 && <Divider padding={0} />}
                </div>
              )
            })
          )}
        </div>
      </section>
    </main>
  )
}

export default ChatList
