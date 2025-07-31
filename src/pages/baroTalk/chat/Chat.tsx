import ChatRoomContainer from '@/container/baroTalk/chatRoomContainer/ChatRoomContainer'
import styles from './chat.module.scss'
import ChatList from '@/container/baroTalk/chatList/ChatList'
import { useCallback } from 'react'
import { useChatRoomId, useSetChatRoomId } from '@/stores/socketStore'

const Chat = () => {
  const chatRoomId = useChatRoomId()
  const setChatRoomId = useSetChatRoomId()

  // 채팅방 클릭 핸들러
  const handleChatRoomClick = useCallback(
    (chatRoomId: number) => {
      setChatRoomId(chatRoomId)
    },
    [setChatRoomId]
  )

  return (
    <main className={`w-full sub-main-container ${styles.chat}`}>
      {chatRoomId ? (
        <ChatRoomContainer chatRoomId={chatRoomId} />
      ) : (
        <section className={`contents-section ${styles['chat-content']}`}>
          <div className='flex items-center justify-center h-full'>
            <p className='text-gray-500'>채팅방을 선택해주세요.</p>
          </div>
        </section>
      )}
      <aside className={`aside ${styles['mobile-aside']}`}>
        <ChatList onChatRoomClick={handleChatRoomClick} />
      </aside>
    </main>
  )
}

export default Chat
