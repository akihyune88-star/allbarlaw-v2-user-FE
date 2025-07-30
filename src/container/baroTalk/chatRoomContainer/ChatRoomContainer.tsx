import ChatHeader from '@/container/baroTalk/chatHeader/ChatHeader'
import ChatBody from '@/container/baroTalk/chatBody/ChatBody'
import styles from './chatRoomContainer.module.scss'
import { ChatMessage, JoinRoomSuccessData, JoinRoomRequest, ChatRoomStatus } from '@/types/baroTalkTypes'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Socket } from 'socket.io-client'
import { useLocation } from 'react-router-dom'
import { useChatStore } from '@/store/chatStore'

interface ChatRoomContainerProps {
  chatRoomId: number | null
  socket: Socket | null
  isConnected: boolean
}

const ChatRoomContainer = ({ chatRoomId, socket, isConnected }: ChatRoomContainerProps) => {
  const { messages, roomInfo, chatStatus, setMessages, setRoomInfo, setChatStatus, addMessage, setIsConnected } =
    useChatStore()

  const location = useLocation()

  const isLawyer = location.pathname.includes('lawyer-admin')

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
    setIsConnected(isConnected)
  }, [isConnected, setIsConnected])

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

    // 이벤트 리스너 등록
    socket.on('joinRoomSuccess', handleJoinRoomSuccess)
    socket.on('joinRoomError', handleJoinRoomError)
    socket.on('newMessage', handleNewMessage)

    // 클린업
    // eslint-disable-next-line
    return () => {
      socket.off('joinRoomSuccess', handleJoinRoomSuccess)
      socket.off('joinRoomError', handleJoinRoomError)
      socket.off('newMessage', handleNewMessage)
    }
  }, [socket, setMessages, setRoomInfo, setChatStatus, addMessage])

  // 메시지 전송 핸들러
  const handleSendMessage = useCallback(
    (content: string) => {
      if (socket && chatRoomId && isConnected) {
        socket.emit('sendMessage', {
          chatRoomId: chatRoomId,
          content: content,
          receiverId: isLawyer ? roomInfo?.chatRoomUserId || 0 : roomInfo?.chatRoomLawyerId || 0,
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
        lawyerId={roomInfo?.chatRoomLawyerId || 0}
        isActive={true}
        lawyerName={roomInfo?.chatRoomLawyer.lawyerName || ''}
        count={{ total: 1256, month: 251 }}
        lawfirmName={roomInfo?.chatRoomLawyer.lawfirmName || ''}
        lawyerProfileImage={roomInfo?.chatRoomLawyer.lawyerProfileImage || 'https://picsum.photos/200/300'}
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
