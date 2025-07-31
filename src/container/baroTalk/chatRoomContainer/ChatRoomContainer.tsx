import ChatHeader from '@/container/baroTalk/chatHeader/ChatHeader'
import ChatBody from '@/container/baroTalk/chatBody/ChatBody'
import styles from './chatRoomContainer.module.scss'
import { useCallback } from 'react'
import { useUpdateChatRoomStatus } from '@/hooks/queries/useBaroTalk'
import { useMessages, useChatStatus, useRoomInfo, useSetChatRoomId, useSetChatStatus } from '@/stores/socketStore'
import { useChatSocket } from '@/hooks/useChatSocket'

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

  // 🆕 커스텀 훅 사용
  const { isConnected, sendMessage, leaveRoom, isLawyer } = useChatSocket({
    chatRoomId,
    setChatStatus,
  })

  // 🆕 상담 끝내기 mutation
  const { mutate: updateChatRoomStatus } = useUpdateChatRoomStatus({
    onSuccess: data => {
      console.log('🟢 상담 끝내기 성공:', data)
      // 채팅방 상태를 COMPLETED로 업데이트
      setChatStatus('COMPLETED')

      // 🆕 소켓 연결은 유지하고 채팅방만 나가기 (소켓 연결은 끊지 않음)
      leaveRoom()

      // 채팅방 ID를 null로 설정하여 채팅창 닫기
      setChatRoomId(null)
    },
    onError: error => {
      console.error('❌ 상담 끝내기 실패:', error)
      alert('상담을 끝내는데 실패했습니다. 다시 시도해주세요.')
    },
  })

  // 🆕 상담 끝내기 핸들러
  const handleEndChat = useCallback(() => {
    if (!chatRoomId) return

    const confirmed = window.confirm(
      '정말로 상담을 끝내시겠습니까?\n\n' +
        '• 상담이 완료된 것으로 처리됩니다\n' +
        '• 더 이상 메시지를 주고받을 수 없습니다\n' +
        '• 이 작업은 되돌릴 수 없습니다'
    )
    if (!confirmed) return

    console.log('🟢 상담 끝내기 요청:', chatRoomId)
    updateChatRoomStatus({
      chatRoomId: chatRoomId,
      status: 'COMPLETED',
    })
  }, [chatRoomId, updateChatRoomStatus])

  // 메시지 전송 핸들러
  const handleSendMessage = useCallback(
    (content: string) => {
      sendMessage(content, roomInfo)
    },
    [sendMessage, roomInfo]
  )

  // 🆕 chatRoomId가 null이면 빈 화면 표시
  if (!chatRoomId) {
    return (
      <section className={`contents-section ${styles['chat-content']}`}>
        <div className='flex items-center justify-center h-full'>
          <p className='text-gray-500'>채팅방을 선택해주세요.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={`contents-section ${styles['chat-content']}`}>
      <ChatHeader
        lawyerId={(roomInfo as any)?.chatRoomLawyerId || 0}
        isActive={true}
        lawyerName={(roomInfo as any)?.chatRoomLawyer?.lawyerName || ''}
        count={{ total: 1256, month: 251 }}
        lawfirmName={(roomInfo as any)?.chatRoomLawyer?.lawfirmName || ''}
        lawyerProfileImage={(roomInfo as any)?.chatRoomLawyer?.lawyerProfileImage || 'https://picsum.photos/200/300'}
        onEndChat={handleEndChat} // 🆕 상담 끝내기 핸들러 전달
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
