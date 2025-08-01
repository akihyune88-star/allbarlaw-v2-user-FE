import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ChatMessage, 
  JoinRoomSuccessData, 
  JoinRoomRequest,
  MarkAsReadRequest,
  MarkAsReadSuccessData,
  MessagesMarkedAsReadData,
  SendMessageSuccessData,
  SendMessageErrorData,
  UserLeftData
} from '@/types/baroTalkTypes'
import {
  useSocket,
  useSetSocket,
  useSetConnected,
  useSetMessages,
  useSetRoomInfo,
  useAddMessage,
  useUpdateMessage,
  useUpdateMessageByTempId,
  useMarkMessagesAsRead,
  useChatStatus,
} from '@/stores/socketStore'
import { useUpdateChatRoomStatus } from '@/hooks/queries/useBaroTalk'

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
  const updateMessage = useUpdateMessage()
  const updateMessageByTempId = useUpdateMessageByTempId()
  const markMessagesAsRead = useMarkMessagesAsRead()
  const currentChatStatus = useChatStatus()

  // 채팅방 상태 업데이트 훅
  const { mutate: updateChatRoomStatus } = useUpdateChatRoomStatus({
    onSuccess: (data) => {
      console.log('🟢 채팅방 상태 업데이트 성공:', data)
      setChatStatus(data.chatRoomStatus)
    },
    onError: (error) => {
      console.error('❌ 채팅방 상태 업데이트 실패:', error)
    }
  })

  // refs for tracking state
  const socketConnectedRef = useRef(false)
  const joinRoomAttemptedRef = useRef(false)
  const markAsReadRef = useRef<((messageIds?: number[]) => void) | null>(null)
  const timeoutRefs = useRef<Set<NodeJS.Timeout>>(new Set())
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
      
      // timeout 정리
      timeoutRefs.current.forEach(timeoutId => {
        clearTimeout(timeoutId)
      })
      timeoutRefs.current.clear()
    }
  }, [userId, chatRoomId, setSocket, setConnected])

  // 읽음 처리 함수 (이벤트 리스너보다 먼저 정의)
  const markAsRead = useCallback(
    (messageIds?: number[]) => {
      if (socket && chatRoomId && socket.connected) {
        const request: MarkAsReadRequest = {
          chatRoomId,
          messageIds
        }
        console.log('🟢 markAsRead 전송:', request)
        socket.emit('markAsRead', request)
      }
    },
    [socket, chatRoomId]
  )

  // ref에 함수 저장
  markAsReadRef.current = markAsRead

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
      
      // 🆕 채팅방 입장 시 나가기 상태 확인 및 처리
      const { userLeft, lawyerLeft, chatRoomIsActive } = data.chatRoom
      
      if (userLeft !== undefined && lawyerLeft !== undefined) {
        console.log('🟢 채팅방 나가기 상태 확인:', { userLeft, lawyerLeft, chatRoomIsActive })
        
        if (!chatRoomIsActive) {
          // 양쪽 모두 나간 경우
          setChatStatus('COMPLETED')
          
          const leaveMessage: ChatMessage = {
            chatMessageId: Date.now(),
            chatMessageContent: '채팅이 종료되었습니다.',
            chatMessageSenderType: 'LAWYER', // 시스템 메시지
            chatMessageSenderId: 0,
            chatMessageCreatedAt: new Date().toISOString(),
          }
          addMessage(leaveMessage)
          
        } else if (userLeft || lawyerLeft) {
          // 한쪽만 나간 경우 (일방향 채팅)
          const leftUserType = userLeft ? '사용자' : '변호사'
          const currentUserLeft = (isLawyer && lawyerLeft) || (!isLawyer && userLeft)
          
          if (currentUserLeft) {
            // 내가 나간 경우 (이론상 불가능하지만 안전장치)
            setChatStatus('COMPLETED')
          } else {
            // 상대방이 나간 경우 - 일방향 채팅 상태
            setChatStatus('PARTIAL_LEFT')
          }
          
          const leaveMessage: ChatMessage = {
            chatMessageId: Date.now(),
            chatMessageContent: `${leftUserType}가 채팅을 나갔습니다.`,
            chatMessageSenderType: 'LAWYER', // 시스템 메시지
            chatMessageSenderId: 0,
            chatMessageCreatedAt: new Date().toISOString(),
          }
          addMessage(leaveMessage)
        } else {
          // 정상 활성 상태
          setChatStatus(data.chatRoom.chatRoomStatus)
        }
      } else {
        // 서버에서 나가기 상태 정보를 제공하지 않는 경우 (기존 방식)
        setChatStatus(data.chatRoom.chatRoomStatus)
      }
      
      // 채팅방 입장 시 안 읽은 메시지들을 자동으로 읽음 처리
      const timeoutId = setTimeout(() => {
        const unreadMessages = data.recentMessages
          .filter(msg => 
            msg.chatMessageSenderType !== (isLawyer ? 'LAWYER' : 'USER') && 
            !msg.chatMessageIsRead
          )
          .map(msg => msg.chatMessageId)
          
        if (unreadMessages.length > 0 && markAsReadRef.current) {
          console.log('🟢 채팅방 입장 시 읽음 처리:', unreadMessages)
          markAsReadRef.current(unreadMessages)
        }
        timeoutRefs.current.delete(timeoutId)
      }, 500) // 500ms 후 읽음 처리
      
      timeoutRefs.current.add(timeoutId)
    }

    // 채팅방 입장 실패
    const handleJoinRoomError = (error: { message: string }) => {
      console.error('❌ joinRoomError:', error.message)
      joinRoomAttemptedRef.current = false
    }

    // 새 메시지 수신
    const handleNewMessage = (message: ChatMessage) => {
      console.log('🟢 newMessage 수신:', message)
      
      // 내가 보낸 메시지인지 확인
      const isMyMessage = message.chatMessageSenderType === (isLawyer ? 'LAWYER' : 'USER')
      
      if (isMyMessage) {
        // 내가 보낸 메시지는 이미 임시로 추가되었으므로 중복 방지
        console.log('🟡 내가 보낸 메시지이므로 중복 추가 방지:', message.chatMessageId)
        return
      }
      
      // 상대방이 보낸 메시지만 추가
      addMessage(message)
      
      // 상대방 메시지 자동 읽음 처리
      const timeoutId = setTimeout(() => {
        console.log('🟢 상대방 메시지 읽음 처리:', [message.chatMessageId])
        if (markAsReadRef.current) {
          markAsReadRef.current([message.chatMessageId])
        }
        timeoutRefs.current.delete(timeoutId)
      }, 1000) // 1초 후 읽음 처리
      
      timeoutRefs.current.add(timeoutId)
    }

    // 메시지 전송 성공
    const handleSendMessageSuccess = (data: SendMessageSuccessData) => {
      console.log('🟢 sendMessageSuccess:', data)
      if (data.tempId) {
        // 임시 메시지를 실제 메시지 ID로 업데이트
        updateMessageByTempId(data.tempId, {
          chatMessageId: data.messageId, // 서버에서 받은 실제 ID
          status: 'sent',
          tempId: undefined // tempId 제거
        })
        console.log(`🔄 임시 메시지 ${data.tempId} → 실제 메시지 ${data.messageId}로 업데이트`)
      }
    }

    // 메시지 전송 실패
    const handleSendMessageError = (error: SendMessageErrorData) => {
      console.error('❌ sendMessageError:', error)
      if (error.tempId) {
        updateMessageByTempId(error.tempId, {
          status: 'failed'
        })
      }
      // 사용자에게 에러 알림 (추후 toast 추가)
    }

    // 읽음 처리 성공
    const handleMarkAsReadSuccess = (data: MarkAsReadSuccessData) => {
      console.log('🟢 markAsReadSuccess:', data)
      // 성공적으로 읽음 처리된 메시지들의 상태 업데이트는 서버에서 처리
    }

    // 상대방이 메시지를 읽음
    const handleMessagesMarkedAsRead = (data: MessagesMarkedAsReadData) => {
      console.log('🟢 messagesMarkedAsRead:', data)
      // 내가 보낸 메시지들이 읽혔을 때
      markMessagesAsRead(data.messageIds)
    }

    // 상대방 퇴장 처리 (새로운 API)
    const handleUserLeft = (data: UserLeftData) => {
      console.log('🟢 userLeft 이벤트 수신:', data)
      
      // 시스템 메시지 생성
      let messageContent = ''
      if (!data.chatRoomIsActive) {
        // 양쪽 모두 나간 경우
        messageContent = '채팅이 종료되었습니다.'
        setChatStatus('COMPLETED')
      } else {
        // 한쪽만 나간 경우 (일방향 채팅)
        const leftUserType = data.userLeft ? '사용자' : '변호사'
        messageContent = `${leftUserType}가 채팅을 나갔습니다.`
        
        // 내가 나간 경우와 상대방이 나간 경우 구분
        const currentUserLeft = (isLawyer && data.lawyerLeft) || (!isLawyer && data.userLeft)
        
        if (currentUserLeft) {
          // 내가 나간 경우
          setChatStatus('COMPLETED')
        } else {
          // 상대방이 나간 경우 - 일방향 채팅 상태
          setChatStatus('PARTIAL_LEFT') // 새로운 상태 (필요시)
        }
      }
      
      const leaveMessage: ChatMessage = {
        chatMessageId: Date.now(),
        chatMessageContent: messageContent,
        chatMessageSenderType: 'LAWYER', // 시스템 메시지
        chatMessageSenderId: 0,
        chatMessageCreatedAt: new Date().toISOString(),
      }

      addMessage(leaveMessage)
    }

    // 채팅방 퇴장 성공
    const handleLeaveRoomSuccess = (data: any) => {
      console.log('🟢 leaveRoomSuccess:', data)
      
      // 본인이 나간 경우 UI 업데이트
      if (data.chatRoomIsActive) {
        // 일방향 채팅 상태
        const leaveMessage: ChatMessage = {
          chatMessageId: Date.now(),
          chatMessageContent: '채팅을 나갔습니다. 상대방은 계속 메시지를 보낼 수 있습니다.',
          chatMessageSenderType: 'LAWYER', // 시스템 메시지
          chatMessageSenderId: 0,
          chatMessageCreatedAt: new Date().toISOString(),
        }
        addMessage(leaveMessage)
      } else {
        // 채팅방 완전 종료
        const leaveMessage: ChatMessage = {
          chatMessageId: Date.now(),
          chatMessageContent: '채팅이 완전히 종료되었습니다.',
          chatMessageSenderType: 'LAWYER', // 시스템 메시지
          chatMessageSenderId: 0,
          chatMessageCreatedAt: new Date().toISOString(),
        }
        addMessage(leaveMessage)
      }
      
      setChatStatus('COMPLETED')
    }

    // 채팅방 퇴장 실패
    const handleLeaveRoomError = (error: { message: string }) => {
      console.error('채팅방 퇴장 실패:', error.message)
    }

    // 이벤트 리스너 등록
    socket.on('joinRoomSuccess', handleJoinRoomSuccess)
    socket.on('joinRoomError', handleJoinRoomError)
    socket.on('newMessage', handleNewMessage)
    socket.on('sendMessageSuccess', handleSendMessageSuccess)
    socket.on('sendMessageError', handleSendMessageError)
    socket.on('markAsReadSuccess', handleMarkAsReadSuccess)
    socket.on('messagesMarkedAsRead', handleMessagesMarkedAsRead)
    socket.on('userLeft', handleUserLeft)
    socket.on('leaveRoomSuccess', handleLeaveRoomSuccess)
    socket.on('leaveRoomError', handleLeaveRoomError)

    // 클린업
    return () => {
      socket.off('joinRoomSuccess', handleJoinRoomSuccess)
      socket.off('joinRoomError', handleJoinRoomError)
      socket.off('newMessage', handleNewMessage)
      socket.off('sendMessageSuccess', handleSendMessageSuccess)
      socket.off('sendMessageError', handleSendMessageError)
      socket.off('markAsReadSuccess', handleMarkAsReadSuccess)
      socket.off('messagesMarkedAsRead', handleMessagesMarkedAsRead)
      socket.off('userLeft', handleUserLeft)
      socket.off('leaveRoomSuccess', handleLeaveRoomSuccess)
      socket.off('leaveRoomError', handleLeaveRoomError)
      
      // timeout 정리
      timeoutRefs.current.forEach(timeoutId => {
        clearTimeout(timeoutId)
      })
      timeoutRefs.current.clear()
    }
  }, [socket, setMessages, setRoomInfo, setChatStatus, addMessage, updateMessage, updateMessageByTempId, markMessagesAsRead, chatRoomId, isLawyer])

  // 메시지 전송 함수
  const sendMessage = useCallback(
    (content: string, roomInfo: any) => {
      if (socket && chatRoomId && socket.connected) {
        const tempId = `temp_${Date.now()}`
        
        // 🆕 변호사가 PENDING 상태에서 첫 메시지를 보낼 때 CONSULTING으로 상태 변경
        if (isLawyer && currentChatStatus === 'PENDING') {
          console.log('🟢 변호사 첫 메시지 → PENDING에서 CONSULTING으로 상태 변경')
          updateChatRoomStatus({
            chatRoomId: chatRoomId,
            status: 'CONSULTING'
          })
        }
        
        // 임시 메시지를 먼저 UI에 표시
        const tempMessage: ChatMessage = {
          chatMessageId: Date.now(), // 임시 ID
          chatMessageContent: content,
          chatMessageSenderType: isLawyer ? 'LAWYER' : 'USER',
          chatMessageSenderId: userId || 0,
          chatMessageReceiverId: isLawyer ? roomInfo?.chatRoomUserId || 0 : roomInfo?.chatRoomLawyerId || 0,
          chatMessageReceiverType: isLawyer ? 'USER' : 'LAWYER',
          chatMessageIsRead: false,
          chatMessageCreatedAt: new Date().toISOString(),
          tempId,
          status: 'sending'
        }
        
        addMessage(tempMessage)
        
        // 서버로 메시지 전송
        socket.emit('sendMessage', {
          chatRoomId: chatRoomId,
          content: content,
          receiverId: isLawyer ? roomInfo?.chatRoomUserId || 0 : roomInfo?.chatRoomLawyerId || 0,
          receiverType: isLawyer ? 'USER' : 'LAWYER',
          tempId,
        })
      }
    },
    [socket, chatRoomId, isLawyer, userId, addMessage, currentChatStatus, updateChatRoomStatus]
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
    markAsRead,
    isLawyer,
  }
}
