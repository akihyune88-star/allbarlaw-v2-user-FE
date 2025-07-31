import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ChatMessage, JoinRoomSuccessData, JoinRoomRequest } from '@/types/baroTalkTypes'
import {
  useSocket,
  useSetSocket,
  useSetConnected,
  useSetMessages,
  useSetRoomInfo,
  useAddMessage,
} from '@/stores/socketStore'

interface UseChatSocketProps {
  chatRoomId: number | null
  setChatStatus: (_status: any) => void
}

export const useChatSocket = ({ chatRoomId, setChatStatus }: UseChatSocketProps) => {
  const { getUserIdFromToken } = useAuth()
  const location = useLocation()
  const isLawyer = location.pathname.includes('lawyer-admin')

  // Zustand 상태
  const socket = useSocket()
  const setSocket = useSetSocket()
  const setConnected = useSetConnected()
  const setMessages = useSetMessages()
  const setRoomInfo = useSetRoomInfo()
  const addMessage = useAddMessage()

  // refs for tracking state
  const socketConnectedRef = useRef(false)
  const joinRoomAttemptedRef = useRef(false)
  const userId = getUserIdFromToken()

  // 소켓 연결
  useEffect(() => {
    if (!userId || !chatRoomId) {
      console.log('❌ useChatSocket - 소켓 연결 조건 불충족:', { userId, chatRoomId })
      return undefined
    }

    console.log('🔍 useChatSocket - 채팅 소켓 연결 시작, userId:', userId, 'chatRoomId:', chatRoomId)

    // 기존 소켓이 있으면 먼저 정리
    if (socket) {
      console.log('🔍 useChatSocket - 기존 소켓 정리')
      socket.disconnect()
    }

    const newSocket = io(import.meta.env.VITE_SERVER_API + '/chat', {
      auth: {
        token: localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || '',
      },
      reconnection: false,
    })

    setSocket(newSocket)
    joinRoomAttemptedRef.current = false

    newSocket.on('connect', () => {
      console.log('✅ 채팅 소켓 연결 성공, socketId:', newSocket.id)
      setConnected(true)
      socketConnectedRef.current = true

      // 소켓 연결 후 즉시 방 입장 시도
      if (chatRoomId) {
        console.log('🟢 소켓 연결 후 방 입장 시도:', chatRoomId)
        const joinRoomRequest: JoinRoomRequest = {
          chatRoomId: chatRoomId,
          loadRecentMessages: true,
          messageLimit: 50,
        }
        newSocket.emit('joinRoom', joinRoomRequest)
        joinRoomAttemptedRef.current = true
      }
    })

    newSocket.on('connect_error', error => {
      console.log('❌ 채팅 소켓 연결 실패:', error.message)
      setConnected(false)
      socketConnectedRef.current = false
    })

    newSocket.on('disconnect', reason => {
      console.log('❌ 채팅 소켓 연결 해제, reason:', reason)
      setConnected(false)
      socketConnectedRef.current = false
      joinRoomAttemptedRef.current = false
    })

    return () => {
      console.log('🔍 useChatSocket - 채팅 소켓 연결 해제')
      newSocket.disconnect()
      socketConnectedRef.current = false
      joinRoomAttemptedRef.current = false
    }
  }, [userId, chatRoomId, setSocket, setConnected])

  // chatRoomId가 변경될 때 방 입장
  useEffect(() => {
    console.log('🔍 useChatSocket - joinRoom useEffect 실행:', {
      chatRoomId,
      socket: !!socket,
      socketConnected: socket?.connected,
      socketId: socket?.id,
      socketConnectedRef: socketConnectedRef.current,
      joinRoomAttemptedRef: joinRoomAttemptedRef.current,
    })

    if (chatRoomId && socket && socket.connected && !joinRoomAttemptedRef.current) {
      const joinRoomRequest: JoinRoomRequest = {
        chatRoomId: chatRoomId,
        loadRecentMessages: true,
        messageLimit: 50,
      }

      console.log('🟢 joinRoom 요청:', joinRoomRequest)
      socket.emit('joinRoom', joinRoomRequest)
      joinRoomAttemptedRef.current = true
    } else {
      console.log('❌ joinRoom 요청 조건 불충족:', {
        chatRoomId: !!chatRoomId,
        socket: !!socket,
        socketConnected: socket?.connected,
        alreadyAttempted: joinRoomAttemptedRef.current,
      })
    }
  }, [chatRoomId, socket])

  // 소켓 연결 상태를 전역 상태에 반영
  useEffect(() => {
    if (socket) {
      setConnected(socket.connected)
    }
  }, [socket, setConnected])

  // 소켓 이벤트 리스너 설정
  useEffect(() => {
    if (!socket) return

    // 채팅방 입장 성공
    const handleJoinRoomSuccess = (data: JoinRoomSuccessData) => {
      console.log('🟢 joinRoomSuccess 응답:', data)
      console.log('🟢 로드된 메시지 수:', data.recentMessages.length)
      setMessages(data.recentMessages)
      setRoomInfo(data.chatRoom)
      setChatStatus(data.chatRoom.chatRoomStatus)
    }

    // 채팅방 입장 실패
    const handleJoinRoomError = (error: { message: string }) => {
      console.error('❌ joinRoomError:', error.message)
      joinRoomAttemptedRef.current = false
    }

    // 새 메시지 수신
    const handleNewMessage = (message: ChatMessage) => {
      addMessage(message)
    }

    // 상대방 퇴장 처리
    const handleUserLeft = (data: { userId: number; userName: string }) => {
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
    const handleLeaveRoomSuccess = () => {
      // 퇴장 성공 처리
      return undefined
    }

    // 채팅방 퇴장 실패
    const handleLeaveRoomError = (error: { message: string }) => {
      console.error('채팅방 퇴장 실패:', error.message)
    }

    // 이벤트 리스너 등록
    socket.on('joinRoomSuccess', handleJoinRoomSuccess)
    socket.on('joinRoomError', handleJoinRoomError)
    socket.on('newMessage', handleNewMessage)
    socket.on('userLeft', handleUserLeft)
    socket.on('leaveRoomSuccess', handleLeaveRoomSuccess)
    socket.on('leaveRoomError', handleLeaveRoomError)

    // 클린업
    return () => {
      socket.off('joinRoomSuccess', handleJoinRoomSuccess)
      socket.off('joinRoomError', handleJoinRoomError)
      socket.off('newMessage', handleNewMessage)
      socket.off('userLeft', handleUserLeft)
      socket.off('leaveRoomSuccess', handleLeaveRoomSuccess)
      socket.off('leaveRoomError', handleLeaveRoomError)
    }
  }, [socket, setMessages, setRoomInfo, setChatStatus, addMessage, chatRoomId])

  // 메시지 전송 함수
  const sendMessage = useCallback(
    (content: string, roomInfo: any) => {
      if (socket && chatRoomId && socket.connected) {
        socket.emit('sendMessage', {
          chatRoomId: chatRoomId,
          content: content,
          receiverId: isLawyer ? roomInfo?.chatRoomUserId || 0 : roomInfo?.chatRoomLawyerId || 0,
          receiverType: isLawyer ? 'USER' : 'LAWYER',
          tempId: `temp_${Date.now()}`,
        })
      }
    },
    [socket, chatRoomId, isLawyer]
  )

  // 채팅방 나가기 함수
  const leaveRoom = useCallback(() => {
    if (socket && chatRoomId) {
      console.log('🟢 채팅방에서 나가기:', chatRoomId)
      socket.emit('leaveRoom', { chatRoomId })
    }
  }, [socket, chatRoomId])

  return {
    socket,
    isConnected: socket?.connected || false,
    sendMessage,
    leaveRoom,
    isLawyer,
  }
}
