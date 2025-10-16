import ChatRoomContainer from '@/container/baroTalk/chatRoomContainer/ChatRoomContainer'
import styles from './lawyerChat.module.scss'
import { useChatRoomId, useSetChatStatus } from '@/stores/socketStore'
import { useLocation } from 'react-router-dom'
import { useChatSocket } from '@/hooks/useChatSocket'

const LawyerChat = () => {
  const chatRoomId = useChatRoomId()
  const setChatStatus = useSetChatStatus()
  const location = useLocation()
  const userLeft = location.state?.userLeft || false
  const clientName = location.state?.clientName
  const clientId = location.state?.clientId

  // LawyerChat 페이지 레벨에서 소켓 연결
  useChatSocket({
    chatRoomId,
    setChatStatus
  })

  return (
    <main className={`w-full sub-main-container ${styles['lawyer-chat']}`}>
      <ChatRoomContainer
        chatRoomId={chatRoomId}
        userLeft={userLeft}
        clientName={clientName}
        clientId={clientId}
      />
    </main>
  )
}

export default LawyerChat
