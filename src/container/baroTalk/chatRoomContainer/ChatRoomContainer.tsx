import ChatHeader from '@/container/baroTalk/chatHeader/ChatHeader'
import ChatBody from '@/container/baroTalk/chatBody/ChatBody'
import styles from './chatRoomContainer.module.scss'
import { useCallback } from 'react'
import { useLeaveChatRoom } from '@/hooks/queries/useBaroTalk'
import { useMessages, useChatStatus, useRoomInfo, useSetChatRoomId, useSocket, useIsConnected, useChatRooms } from '@/stores/socketStore'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

interface ChatRoomContainerProps {
  chatRoomId: number | null
  userLeft?: boolean
  clientName?: string
  clientId?: number
  onBack?: () => void
  isMobile?: boolean
}

const ChatRoomContainer = ({
  chatRoomId,
  userLeft,
  clientName,
  clientId,
  onBack,
  isMobile,
}: ChatRoomContainerProps) => {
  // Zustand 상태 구독
  const messages = useMessages()
  const chatStatus = useChatStatus()
  const roomInfo = useRoomInfo()
  const socket = useSocket()
  const isConnected = useIsConnected()
  const setChatRoomId = useSetChatRoomId()
  const chatRooms = useChatRooms()
  const { userKeyId } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isLawyer = location.pathname.includes('lawyer-admin')

  const { mutate: leaveChatRoom } = useLeaveChatRoom({
    onSuccess: _data => {
      // 서버가 WebSocket 이벤트를 보내지 않는 경우를 대비해 WebSocket leaveRoom도 호출
      if (socket && chatRoomId) {
        socket.emit('leaveRoom', { chatRoomId })
      }
      setChatRoomId(null)

      // 변호사인 경우 변호사 채팅 목록으로 이동
      if (isLawyer) {
        console.log('✅ 변호사 채팅 목록으로 이동 시도')
        navigate('/lawyer-admin/chat-list', { replace: true })
      }
    },
    onError: error => {
      console.error('❌ 채팅방 나가기 실패:', error)
    },
  })

  const handleEndChat = useCallback(() => {
    if (!chatRoomId) {
      return
    }

    const confirmed = window.confirm(
      '정말로 상담을 끝내시겠습니까?\n\n' +
        '• 상담이 완료된 것으로 처리됩니다\n' +
        '• 더 이상 메시지를 주고받을 수 없습니다\n' +
        '• 이 작업은 되돌릴 수 없습니다'
    )

    if (!confirmed) {
      return
    }

    const userType: 'USER' | 'LAWYER' = isLawyer ? 'LAWYER' : 'USER'
    const leaveRequest = {
      roomId: chatRoomId,
      userType,
      reason: '사용자 요청',
      userId: userKeyId!,
    }

    leaveChatRoom(leaveRequest)
  }, [chatRoomId, isLawyer, userKeyId, leaveChatRoom])

  // 메시지 전송 핸들러 - ChatBody에서 직접 처리하도록 변경
  console.log('roomInfo', roomInfo)

  // 실시간 온라인 상태 계산 (chatRooms에서 현재 채팅방 찾기)
  const currentChatRoom = chatRooms.find(room => room.chatRoomId === chatRoomId)
  const isPartnerActive = !isLawyer && currentChatRoom?.partnerOnlineStatus === 'online'

  return (
    <section className={`contents-section ${styles['chat-content']}`}>
      <ChatHeader
        isActive={isPartnerActive}
        count={{ total: 1256, month: 251 }}
        onEndChat={handleEndChat}
        isLawyer={isLawyer}
        onBack={isMobile ? onBack : undefined}
        // 변호사 정보 (유저가 볼 때)
        lawyerName={(roomInfo as any)?.chatRoomLawyer?.lawyerName || ''}
        lawfirmName={(roomInfo as any)?.chatRoomLawyer?.lawfirmName || ''}
        lawyerProfileImage={(roomInfo as any)?.chatRoomLawyer?.lawyerProfileImage || 'https://picsum.photos/200/300'}
        lawyerId={(roomInfo as any)?.chatRoomLawyer?.lawyerId}
        // 유저 정보 (변호사가 볼 때)
        userId={clientId || (roomInfo as any)?.chatRoomUserId || 0}
        userName={clientName}
      />
      <ChatBody
        chatRoomId={chatRoomId}
        type={isLawyer ? 'LAWYER' : 'USER'}
        userLeft={userLeft || false}
        isLawyer={isLawyer}
      />
    </section>
  )
}

export default ChatRoomContainer
