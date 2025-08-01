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
    onSuccess: data => {
      console.log('🟢 [DEBUG] ===== REST API 나가기 성공 =====')
      console.log('🟢 [DEBUG] 응답 데이터:', JSON.stringify(data, null, 2))
      console.log('🟢 [DEBUG] 현재 사용자 타입:', isLawyer ? 'LAWYER' : 'USER')
      console.log('🟢 [DEBUG] 서버에서 userLeft 이벤트 브로드캐스트 대기 중...')

      // 서버가 WebSocket 이벤트를 보내지 않는 경우를 대비해 WebSocket leaveRoom도 호출
      console.log('🟢 [DEBUG] WebSocket leaveRoom 이벤트도 전송하여 상대방에게 알림')
      leaveRoom()

      // 5초 후에 userLeft 이벤트가 오지 않으면 경고 (디버깅용)
      setTimeout(() => {
        console.warn('⚠️ [DEBUG] userLeft 이벤트가 5초 내에 수신되지 않았습니다. 서버 구현을 확인해주세요.')
      }, 5000)

      setChatRoomId(null)
      console.log('🟢 [DEBUG] ===== REST API 나가기 처리 완료 =====')
    },
    onError: _error => {
      console.error('❌ [DEBUG] ===== 채팅방 나가기 실패 =====')
      console.error('❌ [DEBUG] 에러:', _error)
    },
  })

  const handleEndChat = useCallback(() => {
    console.log('🟢 [DEBUG] 나가기 버튼 클릭됨')
    console.log('🟢 [DEBUG] chatRoomId:', chatRoomId)
    console.log('🟢 [DEBUG] isLawyer:', isLawyer)
    console.log('🟢 [DEBUG] userKeyId:', userKeyId)

    if (!chatRoomId) {
      console.log('❌ [DEBUG] chatRoomId가 없어서 나가기 중단')
      return
    }

    const confirmed = window.confirm(
      '정말로 상담을 끝내시겠습니까?\n\n' +
        '• 상담이 완료된 것으로 처리됩니다\n' +
        '• 더 이상 메시지를 주고받을 수 없습니다\n' +
        '• 이 작업은 되돌릴 수 없습니다'
    )

    if (!confirmed) {
      console.log('🟡 [DEBUG] 사용자가 나가기를 취소함')
      return
    }

    console.log('🟢 [DEBUG] REST API 나가기 요청 전송 중...')
    const leaveRequest = {
      roomId: chatRoomId,
      userType: isLawyer ? 'LAWYER' : 'USER',
      reason: '사용자 요청', // API 문서에 맞게 수정
      userId: userKeyId!,
    }
    console.log('🟢 [DEBUG] 나가기 요청 데이터:', leaveRequest)
    console.log('🟢 [DEBUG] API 문서에 따르면 서버는 userLeft 이벤트를 브로드캐스트해야 함')

    leaveChatRoom(leaveRequest)
  }, [chatRoomId, isLawyer, userKeyId, leaveChatRoom])

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
