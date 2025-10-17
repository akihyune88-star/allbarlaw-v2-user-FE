import ChatRoomContainer from '@/container/baroTalk/chatRoomContainer/ChatRoomContainer'
import styles from './lawyerChat.module.scss'
import { useChatRoomId, useIsConnected } from '@/stores/socketStore'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const LawyerChat = () => {
  const chatRoomId = useChatRoomId()
  const isConnected = useIsConnected()
  const location = useLocation()
  const userLeft = location.state?.userLeft || false
  const clientName = location.state?.clientName
  const clientId = location.state?.clientId

  // 소켓 연결은 LawyerAdminLayout에서 이미 처리됨

  // 초기 마운트 시 한 번만 로그
  useEffect(() => {
    console.log('💬 [LAWYER CHAT] 페이지 초기화:', { chatRoomId: chatRoomId || 'null', clientName })
  }, [chatRoomId, clientName])

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
