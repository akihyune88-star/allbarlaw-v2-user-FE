import ChatRoomContainer from '@/container/baroTalk/chatRoomContainer/ChatRoomContainer'
import styles from './chat.module.scss'
import ChatList from '@/container/baroTalk/chatList/ChatList'
import { useCallback, useEffect } from 'react'
import { useChatRoomId, useSetChatRoomId, useSetChatStatus } from '@/stores/socketStore'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useChatSocket } from '@/hooks/useChatSocket'

const Chat = () => {
  const chatRoomId = useChatRoomId()
  const setChatRoomId = useSetChatRoomId()
  const setChatStatus = useSetChatStatus()
  const queryClient = useQueryClient()
  const isMobile = useMediaQuery('(max-width: 80rem)')

  // Chat 페이지 레벨에서 소켓 연결
  useChatSocket({
    chatRoomId,
    setChatStatus,
  })

  // Chat 페이지 진입 시 채팅방 목록 쿼리 무효화하여 새로 불러오기
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY.BARO_TALK_CHAT_LIST],
    })
  }, [queryClient])

  // 채팅방 클릭 핸들러
  const handleChatRoomClick = useCallback(
    (chatRoomId: number) => {
      setChatRoomId(chatRoomId)
    },
    [setChatRoomId]
  )

  // 모바일에서 뒤로가기 핸들러
  const handleBackToList = useCallback(() => {
    setChatRoomId(null)
  }, [setChatRoomId])

  return (
    <main className={`w-full sub-main-container ${styles.chat}`}>
      {isMobile ? (
        // 모바일 레이아웃
        chatRoomId ? (
          <div className={styles['mobile-chat-room']}>
            <ChatRoomContainer chatRoomId={chatRoomId} onBack={handleBackToList} isMobile={true} />
          </div>
        ) : (
          <div className={styles['mobile-chat-list']}>
            <ChatList onChatRoomClick={handleChatRoomClick} />
          </div>
        )
      ) : (
        // 데스크탑 레이아웃
        <>
          {chatRoomId ? (
            <ChatRoomContainer chatRoomId={chatRoomId} />
          ) : (
            <section className={`contents-section ${styles['chat-content']}`}>
              <div className='flex items-center justify-center h-full'>
                <p className='text-gray-500'>채팅방을 선택해주세요.</p>
              </div>
            </section>
          )}
          <aside className='aside'>
            <ChatList onChatRoomClick={handleChatRoomClick} />
          </aside>
        </>
      )}
    </main>
  )
}

export default Chat
