import ChatRoomContainer from '@/container/baroTalk/chatRoomContainer/ChatRoomContainer'
import styles from './lawyerChat.module.scss'
import ChatList from '@/container/baroTalk/chatList/ChatList'
import { useState, useEffect, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '@/contexts/AuthContext'
import { JoinRoomRequest, JoinRoomSuccessData, UserJoinedData } from '@/types/baroTalkTypes'
import { useChatStore } from '@/store/chatStore'

const LawyerChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [testChatRoomId, setTestChatRoomId] = useState<string>('')
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
      console.log('✅ 변호사 WebSocket 연결 성공')
      setIsConnected(true)
      setGlobalIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('❌ 변호사 WebSocket 연결 해제')
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

  // 테스트용 채팅방 입장 핸들러
  const handleTestChatRoomEnter = () => {
    const chatRoomId = parseInt(testChatRoomId)
    if (!isNaN(chatRoomId)) {
      setChatRoomId(chatRoomId)
      setTestChatRoomId('')
    } else {
      alert('올바른 채팅방 ID를 입력해주세요.')
    }
  }

  return (
    <main className={`w-full sub-main-container ${styles['lawyer-chat']}`}>
      <div className={styles['test-input-container']}>
        <input
          type='text'
          value={testChatRoomId}
          onChange={e => setTestChatRoomId(e.target.value)}
          placeholder='채팅방 ID 입력'
          className={styles['test-input']}
        />
        <button onClick={handleTestChatRoomEnter} className={styles['test-button']}>
          채팅방 입장
        </button>
      </div>

      <ChatRoomContainer chatRoomId={chatRoomId} socket={socket} isConnected={isConnected} />
    </main>
  )
}

export default LawyerChat
