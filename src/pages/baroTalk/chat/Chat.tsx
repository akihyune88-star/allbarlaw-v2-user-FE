import ChatRoomContainer from '@/container/baroTalk/chatRoomContainer/ChatRoomContainer'
import styles from './chat.module.scss'
import ChatList from '@/container/baroTalk/chatList/ChatList'
import { useState, useEffect, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '@/contexts/AuthContext'
import { JoinRoomRequest, JoinRoomSuccessData, UserJoinedData } from '@/types/baroTalkTypes'
import { useChatStore } from '@/store/chatStore'

const Chat = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { getUserIdFromToken } = useAuth()
  const { chatRoomId, setChatRoomId, setIsConnected: setGlobalIsConnected } = useChatStore()

  // 소켓 연결
  useEffect(() => {
    const userId = getUserIdFromToken()
    if (!userId) return

    const newSocket = io(import.meta.env.VITE_SERVER_API + '/chat', {
      auth: {
        token: localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || '',
      },
    })

    // 연결 이벤트
    newSocket.on('connect', () => {
      setIsConnected(true)
      setGlobalIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
      setGlobalIsConnected(false)
    })

    // 다른 사용자 입장 알림
    newSocket.on('userJoined', (data: UserJoinedData) => {
      console.log(`사용자 ${data.userId} 입장 (총 ${data.connectedUsers}명)`)
    })

    setSocket(newSocket)

    // eslint-disable-next-line
    return () => {
      newSocket.disconnect()
    }
  }, [getUserIdFromToken, setGlobalIsConnected])

  // 채팅방 클릭 핸들러
  const handleChatRoomClick = useCallback(
    (chatRoomId: number) => {
      setChatRoomId(chatRoomId)
    },
    [setChatRoomId]
  )

  return (
    <main className={`w-full sub-main-container ${styles.chat}`}>
      <ChatRoomContainer chatRoomId={chatRoomId} socket={socket} isConnected={isConnected} />
      <aside className={`aside ${styles['mobile-aside']}`}>
        <ChatList onChatRoomClick={handleChatRoomClick} />
      </aside>
    </main>
  )
}

export default Chat
