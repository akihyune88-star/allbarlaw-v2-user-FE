import ChatHeader from '@/container/baroTalk/chatHeader/ChatHeader'
import ChatBody from '@/container/baroTalk/chatBody/ChatBody'
import styles from './chatRoomContainer.module.scss'
import { useCallback } from 'react'
import { useLeaveChatRoom } from '@/hooks/queries/useBaroTalk'
import { useMessages, useChatStatus, useRoomInfo, useSetChatRoomId, useSetChatStatus } from '@/stores/socketStore'
import { useChatSocket } from '@/hooks/useChatSocket'
import { useAuth } from '@/contexts/AuthContext'

interface ChatRoomContainerProps {
  chatRoomId: number | null
}

const ChatRoomContainer = ({ chatRoomId }: ChatRoomContainerProps) => {
  // 🟢 Zustand 상태 구독
  const messages = useMessages()
  const chatStatus = useChatStatus()
  const roomInfo = useRoomInfo()
  const setChatRoomId = useSetChatRoomId()
  const setChatStatus = useSetChatStatus()
  const { userKeyId } = useAuth()

  // 🆕 커스텀 훅 사용
  const { isConnected, sendMessage, leaveRoom, isLawyer } = useChatSocket({
    chatRoomId,
    setChatStatus,
  })

  const { mutate: leaveChatRoom } = useLeaveChatRoom({
    onSuccess: () => {
      setChatStatus('COMPLETED')
      leaveRoom()
      setChatRoomId(null)
    },
    onError: error => {
      console.error('❌ 채팅방 나가기 실패:', error)
    },
  })

  const handleEndChat = useCallback(() => {
    if (!chatRoomId) return

    const confirmed = window.confirm(
      '정말로 상담을 끝내시겠습니까?\n\n' +
        '• 상담이 완료된 것으로 처리됩니다\n' +
        '• 더 이상 메시지를 주고받을 수 없습니다\n' +
        '• 이 작업은 되돌릴 수 없습니다'
    )
    if (!confirmed) return

    leaveChatRoom({
      roomId: chatRoomId,
      userType: isLawyer ? 'LAWYER' : 'USER',
      reason: 'USER_LEFT',
      userId: userKeyId!,
    })
  }, [chatRoomId])

  // 메시지 전송 핸들러
  const handleSendMessage = useCallback(
    (content: string) => {
      sendMessage(content, roomInfo)
    },
    [sendMessage, roomInfo]
  )

  return (
    <section className={`contents-section ${styles['chat-content']}`}>
      <ChatHeader
        lawyerId={(roomInfo as any)?.chatRoomLawyerId || 0}
        isActive={true}
        lawyerName={(roomInfo as any)?.chatRoomLawyer?.lawyerName || ''}
        count={{ total: 1256, month: 251 }}
        lawfirmName={(roomInfo as any)?.chatRoomLawyer?.lawfirmName || ''}
        lawyerProfileImage={(roomInfo as any)?.chatRoomLawyer?.lawyerProfileImage || 'https://picsum.photos/200/300'}
        onEndChat={handleEndChat}
      />
      <ChatBody
        chatRoomId={chatRoomId}
        chatStatus={chatStatus}
        messages={messages}
        onSendMessage={handleSendMessage}
        isConnected={isConnected}
        type={isLawyer ? 'LAWYER' : 'USER'}
      />
    </section>
  )
}

export default ChatRoomContainer
