import ChatRoomContainer from '@/container/baroTalk/chatRoomContainer/ChatRoomContainer'
import styles from './lawyerChat.module.scss'
import { useState, useEffect, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '@/contexts/AuthContext'
import { UserJoinedData } from '@/types/baroTalkTypes'
import { useSocketInstance, useSocketConnection, useChatRoomId } from '@/hooks/queries/useSocket'

const LawyerChat = () => {
  const [testChatRoomId, setTestChatRoomId] = useState<string>('')
  const { getUserIdFromToken } = useAuth()

  // 🟢 React Query 훅들 사용
  const { socket, setSocket } = useSocketInstance()
  const { isConnected, setConnected } = useSocketConnection()
  const { chatRoomId, setChatRoomId } = useChatRoomId()

  // 소켓 연결
  useEffect(() => {
    console.log('🟢 [LawyerChat] 소켓 연결 useEffect 실행')

    const userId = getUserIdFromToken()
    const accessToken = localStorage.getItem('accessToken')
    const sessionToken = sessionStorage.getItem('accessToken')
    const finalToken = accessToken || sessionToken || ''

    console.log('🔍 [LawyerChat] 소켓 연결 시도:', {
      userId: userId,
      userIdType: typeof userId,
      hasAccessToken: !!accessToken,
      hasSessionToken: !!sessionToken,
      finalTokenLength: finalToken.length,
      serverUrl: import.meta.env.VITE_SERVER_API + '/chat',
      timestamp: new Date().toISOString(),
    })

    if (!userId) {
      console.log('❌ [LawyerChat] userId가 없어서 소켓 연결 중단')
      return
    }

    console.log('🟢 [LawyerChat] 소켓 생성 시작')
    const newSocket = io(import.meta.env.VITE_SERVER_API + '/chat', {
      auth: {
        token: finalToken,
      },
    })

    console.log('🟢 [LawyerChat] 소켓 인스턴스 생성됨:', !!newSocket)

    setSocket(newSocket)
    console.log('🟢 [LawyerChat] setSocket 호출됨')

    newSocket.on('connect', () => {
      console.log('🟢 [LawyerChat] 소켓 연결 성공, socketId:', newSocket.id)
      setConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('❌ [LawyerChat] 소켓 연결 해제')
      setConnected(false)
    })

    newSocket.on('connect_error', error => {
      console.error('❌ [LawyerChat] 소켓 연결 에러:', error)
    })

    newSocket.on('userJoined', (data: UserJoinedData) => {
      console.log(`🟢 [LawyerChat] 사용자 ${data.userId} 입장 (총 ${data.connectedUsers}명)`)
    })

    return () => {
      console.log('🟢 [LawyerChat] 소켓 연결 해제 (cleanup)')
      newSocket.disconnect()
    }
  }, [getUserIdFromToken()]) // 함수 호출 결과를 의존성으로 변경

  // 채팅방 클릭 핸들러
  const handleChatRoomClick = useCallback(
    (chatRoomId: number) => {
      setChatRoomId(chatRoomId) // React Query로 채팅방 ID 관리
    },
    [setChatRoomId]
  )

  // 테스트용 채팅방 입장 핸들러
  const handleTestChatRoomEnter = () => {
    const chatRoomId = parseInt(testChatRoomId)
    if (!isNaN(chatRoomId)) {
      setChatRoomId(chatRoomId) // React Query로 채팅방 ID 관리
      setTestChatRoomId('')
    } else {
      alert('올바른 채팅방 ID를 입력해주세요.')
    }
  }

  return (
    <main className={`w-full sub-main-container ${styles['lawyer-chat']}`}>
      {chatRoomId && <ChatRoomContainer chatRoomId={chatRoomId} socket={socket} isConnected={isConnected} />}
    </main>
  )
}

export default LawyerChat
