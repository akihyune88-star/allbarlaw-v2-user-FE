import ChatRoomContainer from '@/container/baroTalk/chatRoomContainer/ChatRoomContainer'
import styles from './lawyerChat.module.scss'
import { useChatRoomId } from '@/stores/socketStore'
import { useLocation } from 'react-router-dom'

const LawyerChat = () => {
  const chatRoomId = useChatRoomId()
  const location = useLocation()
  const userLeft = location.state?.userLeft || false

  return (
    <main className={`w-full sub-main-container ${styles['lawyer-chat']}`}>
      <ChatRoomContainer chatRoomId={chatRoomId} userLeft={userLeft} />
    </main>
  )
}

export default LawyerChat
