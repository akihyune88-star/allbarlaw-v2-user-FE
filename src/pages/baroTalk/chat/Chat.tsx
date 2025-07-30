import ChatRoomContainer from '@/container/baroTalk/chatRoomContainer/ChatRoomContainer'
import styles from './chat.module.scss'
import ChatList from '@/container/baroTalk/chatList/ChatList'
import { useState, useEffect, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '@/contexts/AuthContext'
import { UserJoinedData } from '@/types/baroTalkTypes'
import { useSocketInstance, useSocketConnection, useChatRoomId } from '@/hooks/queries/useSocket'

const Chat = () => {
  const { getUserIdFromToken } = useAuth()

  // 🟢 React Query 훅들 사용
  const { socket, setSocket } = useSocketInstance()
  const { isConnected, setConnected } = useSocketConnection()
  const { chatRoomId, setChatRoomId } = useChatRoomId()

  // 소켓 연결
  useEffect(() => {
    const userId = getUserIdFromToken()
    if (!userId) return

    const newSocket = io(import.meta.env.VITE_SERVER_API + '/chat', {
      auth: {
        token: localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || '',
      },
    })

    // 먼저 소켓 인스턴스를 설정
    setSocket(newSocket)

    // 연결 이벤트
    newSocket.on('connect', () => {
      console.log('🟢 Chat: 소켓 연결 성공')
      setConnected(true) // React Query 상태 업데이트
    })

    newSocket.on('disconnect', () => {
      console.log('❌ Chat: 소켓 연결 해제')
      setConnected(false) // React Query 상태 업데이트
    })

    // 다른 사용자 입장 알림
    newSocket.on('userJoined', (data: UserJoinedData) => {
      console.log(`사용자 ${data.userId} 입장 (총 ${data.connectedUsers}명)`)
    })

    // eslint-disable-next-line
    return () => {
      newSocket.disconnect()
    }
  }, [getUserIdFromToken]) // setConnected, setSocket 제거

  // 채팅방 클릭 핸들러
  const handleChatRoomClick = useCallback(
    (chatRoomId: number) => {
      console.log('🟢 Chat: 채팅방 클릭됨, chatRoomId:', chatRoomId)
      setChatRoomId(chatRoomId) // React Query로 채팅방 ID 관리
    },
    [setChatRoomId]
  )

  return (
    <main className={`w-full sub-main-container ${styles.chat}`}>
      {chatRoomId && <ChatRoomContainer chatRoomId={chatRoomId} socket={socket} isConnected={isConnected} />}
      <aside className={`aside ${styles['mobile-aside']}`}>
        <ChatList onChatRoomClick={handleChatRoomClick} />
      </aside>
    </main>
  )
}

export default Chat
