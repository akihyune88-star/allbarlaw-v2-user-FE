import ChatRoomContainer from '@/container/baroTalk/chatRoomContainer/ChatRoomContainer'
import styles from './lawyerChat.module.scss'
import { useChatRoomId, useSetChatRoomId } from '@/stores/socketStore'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'

const LawyerChat = () => {
  const chatRoomIdFromStore = useChatRoomId()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const setChatRoomId = useSetChatRoomId()

  // URL query parameter에서 정보 가져오기 (새 창으로 열린 경우)
  const chatRoomIdFromUrl = searchParams.get('chatRoomId')
  const clientNameFromUrl = searchParams.get('clientName')
  const clientIdFromUrl = searchParams.get('clientId')
  const userLeftFromUrl = searchParams.get('userLeft')

  // location.state에서 정보 가져오기 (navigate로 이동한 경우)
  const userLeftFromState = location.state?.userLeft || false
  const clientNameFromState = location.state?.clientName
  const clientIdFromState = location.state?.clientId

  // URL 우선, 그 다음 state, 마지막으로 store
  const chatRoomId = chatRoomIdFromUrl ? parseInt(chatRoomIdFromUrl) : chatRoomIdFromStore
  const clientName = clientNameFromUrl || clientNameFromState
  const clientId = clientIdFromUrl ? parseInt(clientIdFromUrl) : clientIdFromState
  const userLeft = userLeftFromUrl === 'true' || userLeftFromState

  // URL에서 chatRoomId를 가져온 경우 store에 설정
  useEffect(() => {
    if (chatRoomIdFromUrl && parseInt(chatRoomIdFromUrl) !== chatRoomIdFromStore) {
      console.log('💬 [LAWYER CHAT] URL에서 chatRoomId 설정:', chatRoomIdFromUrl)
      setChatRoomId(parseInt(chatRoomIdFromUrl))
    }
  }, [chatRoomIdFromUrl, chatRoomIdFromStore, setChatRoomId])

  // 초기 마운트 시 한 번만 로그
  useEffect(() => {
    console.log('💬 [LAWYER CHAT] 페이지 초기화:', { chatRoomId: chatRoomId || 'null', clientName })
  }, [chatRoomId, clientName])

  return (
    <main className={`w-full sub-main-container ${styles['lawyer-chat']} lawyer-chat-page`}>
      <ChatRoomContainer
        chatRoomId={chatRoomId}
        userLeft={userLeft}
        clientName={clientName}
        clientId={clientId}
        fixedInputBar={true}
      />
    </main>
  )
}

export default LawyerChat
