import ChatRoomContainer from '@/container/baroTalk/chatRoomContainer/ChatRoomContainer'
import styles from './lawyerChat.module.scss'
import { useChatRoomId } from '@/stores/socketStore'

const LawyerChat = () => {
  const chatRoomId = useChatRoomId()

  return (
    <main className={`w-full sub-main-container ${styles['lawyer-chat']}`}>
      <ChatRoomContainer chatRoomId={chatRoomId} />
    </main>
  )
}

export default LawyerChat
