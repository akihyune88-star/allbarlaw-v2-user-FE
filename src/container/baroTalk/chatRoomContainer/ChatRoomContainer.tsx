import ChatHeader from '@/container/baroTalk/chatHeader/ChatHeader'
import ChatBody from '@/container/baroTalk/chatBody/ChatBody'
import styles from './chatRoomContainer.module.scss'
import { ChatMessage, JoinRoomSuccessData, JoinRoomRequest } from '@/types/baroTalkTypes'
import { useState, useEffect, useCallback } from 'react'
import { Socket } from 'socket.io-client'

interface ChatRoomContainerProps {
  chatRoomId: number | null
  socket: Socket | null
  isConnected: boolean
}

const ChatRoomContainer = ({ chatRoomId, socket, isConnected }: ChatRoomContainerProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [roomInfo, setRoomInfo] = useState<JoinRoomSuccessData['chatRoom'] | null>(null)
  console.log('roomInfo', roomInfo)

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

  // 소켓 이벤트 리스너 설정
  useEffect(() => {
    if (!socket) return

    // 채팅방 입장 성공
    const handleJoinRoomSuccess = (data: JoinRoomSuccessData) => {
      setMessages(data.recentMessages)
      setRoomInfo(data.chatRoom)
    }

    // 채팅방 입장 실패
    const handleJoinRoomError = (error: { message: string }) => {
      console.error('채팅방 입장 실패:', error.message)
    }

    // 새 메시지 수신
    const handleNewMessage = (message: ChatMessage) => {
      console.log('새 메시지 수신:', message)
      setMessages(prev => [...prev, message])
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
  }, [socket])

  // 메시지 전송 핸들러
  const handleSendMessage = useCallback(
    (content: string) => {
      if (socket && chatRoomId && isConnected) {
        socket.emit('sendMessage', {
          chatRoomId: chatRoomId,
          content: content,
        })
      }
    },
    [socket, chatRoomId, isConnected]
  )

  return (
    <section className={`contents-section ${styles['chat-content']}`}>
      <ChatHeader
        lawyerId={roomInfo?.chatRoomLawyerId || 0}
        isActive={true}
        lawyerName={roomInfo?.chatRoomLawyer.lawyerName || ''}
        count={{ total: 1256, month: 251 }}
        lawfirmName={'example로펌'}
        lawyerProfileImage={roomInfo?.chatRoomLawyer.lawyerProfileImage || 'https://picsum.photos/200/300'}
      />
      <ChatBody
        chatStatus={(roomInfo?.chatRoomStatus as 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED') || 'PENDING'}
        messages={messages}
        onSendMessage={handleSendMessage}
        isConnected={isConnected}
      />
    </section>
  )
}

export default ChatRoomContainer
