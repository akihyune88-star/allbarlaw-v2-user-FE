import ChatRoomContainer from '@/container/baroTalk/chatRoomContainer/ChatRoomContainer'
import styles from './lawyerChat.module.scss'
import { useEffect, useMemo } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '@/contexts/AuthContext'
import { UserJoinedData } from '@/types/baroTalkTypes'
import { useSocket, useIsConnected, useChatRoomId, useSetSocket, useSetConnected } from '@/stores/socketStore'

const LawyerChat = () => {
  const { getUserIdFromToken } = useAuth()

  // 🟢 Zustand 상태 구독
  const socket = useSocket()
  const isConnected = useIsConnected()
  const chatRoomId = useChatRoomId()
  const setSocket = useSetSocket()
  const setConnected = useSetConnected()

  // userId를 안정적으로 메모이제이션
  const userId = useMemo(() => getUserIdFromToken(), [getUserIdFromToken])

  // 소켓 연결
  useEffect(() => {
    if (!userId) return undefined

    const newSocket = io(import.meta.env.VITE_SERVER_API + '/chat', {
      auth: {
        token: localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || '',
      },
    })

    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('✅ 변호사 WebSocket 연결 성공')
      setConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('❌ 변호사 WebSocket 연결 해제')
      setConnected(false)
    })

    newSocket.on('userJoined', (data: UserJoinedData) => {
      console.log(`사용자 ${data.userId} 입장 (총 ${data.connectedUsers}명)`)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [userId])

  return (
    <main className={`w-full sub-main-container ${styles['lawyer-chat']}`}>
      {chatRoomId && <ChatRoomContainer chatRoomId={chatRoomId} socket={socket} isConnected={isConnected} />}
    </main>
  )
}

export default LawyerChat
