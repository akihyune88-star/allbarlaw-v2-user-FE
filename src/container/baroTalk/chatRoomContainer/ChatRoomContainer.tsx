import ChatHeader from '@/container/baroTalk/chatHeader/ChatHeader'
import ChatBody from '@/container/baroTalk/chatBody/ChatBody'
import styles from './chatRoomContainer.module.scss'
import { ChatMessage, JoinRoomSuccessData, JoinRoomRequest, ChatRoomStatus } from '@/types/baroTalkTypes'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Socket } from 'socket.io-client'
import { useLocation } from 'react-router-dom'
import {
  useChatMessages,
  useChatStatus,
  useChatRoomInfo,
  useSocketConnection,
  useChatRoomId,
} from '@/hooks/queries/useSocket'
import { useUpdateChatRoomStatus } from '@/hooks/queries/useBaroTalk'

interface ChatRoomContainerProps {
  chatRoomId: number | null
  socket: Socket | null
  isConnected: boolean
}

const ChatRoomContainer = ({ chatRoomId, socket, isConnected }: ChatRoomContainerProps) => {
  // 🟢 React Query 훅들 사용
  const { messages, addMessage, setMessages } = useChatMessages(chatRoomId)
  const { chatStatus, setChatStatus } = useChatStatus(chatRoomId)
  const { roomInfo, setRoomInfo } = useChatRoomInfo(chatRoomId)
  const { setConnected } = useSocketConnection()
  const { setChatRoomId } = useChatRoomId() // 🆕 채팅방 ID 초기화용


  const location = useLocation()
  const isLawyer = location.pathname.includes('lawyer-admin')

  // 🆕 상담 끝내기 mutation
  const { mutate: updateChatRoomStatus } = useUpdateChatRoomStatus({
    onSuccess: data => {
      console.log('🟢 상담 끝내기 성공:', data)
      // 채팅방 상태를 COMPLETED로 업데이트
      setChatStatus('COMPLETED')

      // 🆕 소켓 연결은 유지하고 채팅방만 나가기 (소켓 연결은 끊지 않음)
      if (socket && chatRoomId) {
        console.log('🟢 채팅방에서 나가기 (소켓 연결 유지):', chatRoomId)
        socket.emit('leaveRoom', { chatRoomId })
      }

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

  // chatRoomId가 변경될 때 방 입장
  useEffect(() => {
    if (chatRoomId && socket && isConnected) {
      const joinRoomRequest: JoinRoomRequest = {
        chatRoomId: chatRoomId,
        loadRecentMessages: true,
        messageLimit: 50,
      }

      socket.emit('joinRoom', joinRoomRequest)
    }
  }, [chatRoomId, socket, isConnected])

  // 소켓 연결 상태를 전역 상태에 반영
  useEffect(() => {
    setConnected(isConnected)
  }, [isConnected, setConnected])

  // 소켓 이벤트 리스너 설정
  useEffect(() => {
    if (!socket) return

    // 채팅방 입장 성공
    const handleJoinRoomSuccess = (data: JoinRoomSuccessData) => {
      setMessages(data.recentMessages)
      setRoomInfo(data.chatRoom)
      setChatStatus(data.chatRoom.chatRoomStatus)
    }

    // 채팅방 입장 실패
    const handleJoinRoomError = (error: { message: string }) => {
      console.error('채팅방 입장 실패:', error.message)
    }

    // 새 메시지 수신
    const handleNewMessage = (message: ChatMessage) => {
      addMessage(message)
    }

    // 상대방 퇴장 처리
    const handleUserLeft = (data: { userId: number; userName: string }) => {
      // 상대방 퇴장 메시지 추가 (시스템 메시지로 처리)
      const leaveMessage: ChatMessage = {
        chatMessageId: Date.now(),
        chatMessageContent: `${data.userName}님이 상담을 종료했습니다.`,
        chatMessageSenderType: 'LAWYER',
        chatMessageSenderId: 0,
        chatMessageCreatedAt: new Date().toISOString(),
      }

      addMessage(leaveMessage)
      setChatStatus('COMPLETED')
    }

    // 채팅방 퇴장 성공
    const handleLeaveRoomSuccess = (data: { chatRoomId: number }) => {
      // 퇴장 성공 처리
    }

    // 채팅방 퇴장 실패
    const handleLeaveRoomError = (error: { message: string }) => {
      console.error('채팅방 퇴장 실패:', error.message)
    }

    // 이벤트 리스너 등록
    socket.on('joinRoomSuccess', handleJoinRoomSuccess)
    socket.on('joinRoomError', handleJoinRoomError)
    socket.on('newMessage', handleNewMessage)
    socket.on('userLeft', handleUserLeft) // 🆕 상대방 퇴장
    socket.on('leaveRoomSuccess', handleLeaveRoomSuccess) // 🆕 퇴장 성공
    socket.on('leaveRoomError', handleLeaveRoomError) // 🆕 퇴장 실패

    // 클린업
    // eslint-disable-next-line
    return () => {
      socket.off('joinRoomSuccess', handleJoinRoomSuccess)
      socket.off('joinRoomError', handleJoinRoomError)
      socket.off('newMessage', handleNewMessage)
      socket.off('userLeft', handleUserLeft) // 🆕 상대방 퇴장
      socket.off('leaveRoomSuccess', handleLeaveRoomSuccess) // 🆕 퇴장 성공
      socket.off('leaveRoomError', handleLeaveRoomError) // 🆕 퇴장 실패
    }
  }, [socket, setMessages, setRoomInfo, setChatStatus, addMessage, chatRoomId])

  // 메시지 전송 핸들러
  const handleSendMessage = useCallback(
    (content: string) => {
      if (socket && chatRoomId && isConnected) {
        socket.emit('sendMessage', {
          chatRoomId: chatRoomId,
          content: content,
          receiverId: isLawyer ? (roomInfo as any)?.chatRoomUserId || 0 : (roomInfo as any)?.chatRoomLawyerId || 0,
          receiverType: isLawyer ? 'USER' : 'LAWYER',
          tempId: `temp_${Date.now()}`, // 임시 ID 생성
        })
      }
    },
    [socket, chatRoomId, isConnected, location.pathname, roomInfo]
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
