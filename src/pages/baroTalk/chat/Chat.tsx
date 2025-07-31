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
      {chatRoomId && <ChatRoomContainer chatRoomId={chatRoomId} />}
      <aside className={`aside ${styles['mobile-aside']}`}>
        <ChatList onChatRoomClick={handleChatRoomClick} />
      </aside>
    </main>
  )
}

export default Chat
