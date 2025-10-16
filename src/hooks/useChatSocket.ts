import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  ChatMessage,
  JoinRoomSuccessData,
  JoinRoomRequest,
  MarkAsReadRequest,
  MessagesMarkedAsReadData,
  SendMessageSuccessData,
  SendMessageErrorData,
  UserLeftData,
  ChatRoomStatus,
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
  useSocketStore,
} from '@/stores/socketStore'
import { useUpdateChatRoomStatus } from '@/hooks/queries/useBaroTalk'

interface UseChatSocketProps {
  chatRoomId: number | null
  setChatStatus: (_status: ChatRoomStatus) => void
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
    onSuccess: data => {
      console.log('✅ [STATUS] 채팅방 상태 업데이트 성공:', data)
      setChatStatus(data.chatRoomStatus)
    },
    onError: error => {
      console.error('❌ [STATUS] 채팅방 상태 업데이트 실패:', error)
    },
  })

  // refs for tracking state
  const socketConnectedRef = useRef(false)
  const joinRoomAttemptedRef = useRef(false)
  const markAsReadRef = useRef<((_messageIds?: number[]) => void) | null>(null)
  const timeoutRefs = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const userId = getUserIdFromToken()

  // 소켓 연결
  useEffect(() => {
    if (!userId) {
      return
    }

    // 기존 소켓이 있으면 먼저 정리
    if (socket) {
      console.log('🔄 [SOCKET] 기존 소켓 연결 해제')
      socket.disconnect()
    }

    // 🆕 배포환경 디버깅을 위한 로그
    console.log('🔍 [SOCKET] 소켓 연결 시도:', {
      userId,
      chatRoomId: chatRoomId || 'null (채팅방 미선택)',
      serverUrl: import.meta.env.VITE_SERVER_API + '/chat',
      token: localStorage.getItem('accessToken') ? '토큰 존재' : '토큰 없음',
      sessionToken: sessionStorage.getItem('accessToken') ? '세션토큰 존재' : '세션토큰 없음',
    })

    const newSocket = io(import.meta.env.VITE_SERVER_API + '/chat', {
      auth: {
        token: localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || '',
      },
      reconnection: false,
    })

    setSocket(newSocket)
    joinRoomAttemptedRef.current = false

    // 🔍 모든 소켓 이벤트 로깅
    newSocket.onAny((eventName, ...args) => {
      console.log(`📡 [SOCKET EVENT] ${eventName}`, args)
    })

    // 🔍 등록된 이벤트 리스너 목록 출력
    newSocket.on('connect', () => {
      console.log('✅ [SOCKET] 소켓 연결 성공')
      setConnected(true)
      socketConnectedRef.current = true

      // @ts-ignore - 내부 API 접근
      const callbacks = newSocket._callbacks || {}
      console.log('📋 [SOCKET] 등록된 이벤트 리스너:', Object.keys(callbacks))

      // 소켓 연결 후 즉시 방 입장 시도
      if (chatRoomId) {
        const joinRoomRequest: JoinRoomRequest = {
          chatRoomId: chatRoomId,
          loadRecentMessages: true,
          messageLimit: 50,
        }
        console.log('🔍 [SOCKET] 방 입장 요청:', joinRoomRequest)
        newSocket.emit('joinRoom', joinRoomRequest)
        joinRoomAttemptedRef.current = true
      }
    })

    newSocket.on('connect_error', error => {
      console.error('❌ [SOCKET] 소켓 연결 실패:', error.message)
      setConnected(false)
      socketConnectedRef.current = false
    })

    newSocket.on('disconnect', reason => {
      console.log('🔌 [SOCKET] 소켓 연결 끊김 - 이유:', reason)
      console.trace('🔌 [SOCKET] 소켓 끊김 스택 트레이스')
      setConnected(false)
      socketConnectedRef.current = false
      joinRoomAttemptedRef.current = false
    })

    return () => {
      console.log('🧹 [SOCKET] useEffect cleanup - 소켓 연결 해제')
      newSocket.offAny() // 모든 이벤트 리스너 제거
      newSocket.disconnect()
      socketConnectedRef.current = false
      joinRoomAttemptedRef.current = false

      // timeout 정리
      timeoutRefs.current.forEach(timeoutId => {
        clearTimeout(timeoutId)
      })
      timeoutRefs.current.clear()
    }
  }, [userId, setSocket, setConnected])

  // 읽음 처리 함수 (이벤트 리스너보다 먼저 정의)
  const markAsRead = useCallback(
    (messageIds?: number[]) => {
      if (socket && chatRoomId && socket.connected) {
        const request: MarkAsReadRequest = {
          chatRoomId,
          messageIds,
        }
        socket.emit('markAsRead', request)
      }
    },
    [socket, chatRoomId]
  )

  // ref에 함수 저장
  markAsReadRef.current = markAsRead

  // chatRoomId가 변경될 때 방 입장
  useEffect(() => {
    if (chatRoomId && socket && socket.connected && !joinRoomAttemptedRef.current) {
      const joinRoomRequest: JoinRoomRequest = {
        chatRoomId: chatRoomId,
        loadRecentMessages: true,
        messageLimit: 50,
      }

      console.log('🔍 [SOCKET] 방 입장 재시도:', joinRoomRequest)
      socket.emit('joinRoom', joinRoomRequest)
      joinRoomAttemptedRef.current = true
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
      console.log('✅ [SOCKET] 방 입장 성공:', data)
      setMessages(data.recentMessages)
      setRoomInfo(data.chatRoom)

      // 🆕 채팅방 입장 시 나가기 상태 확인 및 처리
      const { userLeft, lawyerLeft, chatRoomIsActive } = data.chatRoom

      if (userLeft !== undefined && lawyerLeft !== undefined) {
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
          .filter(msg => msg.chatMessageSenderType !== (isLawyer ? 'LAWYER' : 'USER') && !msg.chatMessageIsRead)
          .map(msg => msg.chatMessageId)

        if (unreadMessages.length > 0 && markAsReadRef.current) {
          markAsReadRef.current(unreadMessages)
        }
        timeoutRefs.current.delete(timeoutId)
      }, 500) // 500ms 후 읽음 처리

      timeoutRefs.current.add(timeoutId)
    }

    // 채팅방 입장 실패
    const handleJoinRoomError = (error: { message: string }) => {
      console.error('❌ [SOCKET] 방 입장 실패:', error.message)
      joinRoomAttemptedRef.current = false
    }

    // 새 메시지 수신
    const handleNewMessage = (message: ChatMessage) => {
      console.log('📨 [SOCKET] 새 메시지 수신:', message)

      // 내가 보낸 메시지인지 확인
      const isMyMessage = message.chatMessageSenderType === (isLawyer ? 'LAWYER' : 'USER')

      if (isMyMessage) {
        // 내가 보낸 메시지는 이미 임시로 추가되었으므로 중복 방지
        return
      }

      // 중복 메시지 방지: 같은 ID의 메시지가 이미 있는지 확인
      const currentMessages = useSocketStore.getState().messages
      const isDuplicateMessage = currentMessages.some(msg => msg.chatMessageId === message.chatMessageId)

      if (isDuplicateMessage) {
        return
      }

      // 상대방이 보낸 메시지만 추가
      addMessage(message)

      // 상대방 메시지 자동 읽음 처리
      const timeoutId = setTimeout(() => {
        if (markAsReadRef.current) {
          markAsReadRef.current([message.chatMessageId])
        }
        timeoutRefs.current.delete(timeoutId)
      }, 1000) // 1초 후 읽음 처리

      timeoutRefs.current.add(timeoutId)
    }

    // 메시지 전송 성공
    const handleSendMessageSuccess = (data: SendMessageSuccessData) => {
      console.log('✅ [SOCKET] 메시지 전송 성공:', data)
      if (data.tempId) {
        // 임시 메시지를 실제 메시지 ID로 업데이트
        updateMessageByTempId(data.tempId, {
          chatMessageId: data.messageId, // 서버에서 받은 실제 ID
          status: 'sent',
          tempId: undefined, // tempId 제거
        })
      }
    }

    // 메시지 전송 실패
    const handleSendMessageError = (error: SendMessageErrorData) => {
      console.error('❌ [SOCKET] 메시지 전송 실패:', error)
      if (error.tempId) {
        updateMessageByTempId(error.tempId, {
          status: 'failed',
        })
      }
      // 사용자에게 에러 알림 (추후 toast 추가)
    }

    // 읽음 처리 성공
    const handleMarkAsReadSuccess = () => {
      // 성공적으로 읽음 처리된 메시지들의 상태 업데이트는 서버에서 처리
    }

    // 상대방이 메시지를 읽음
    const handleMessagesMarkedAsRead = (data: MessagesMarkedAsReadData) => {
      // 내가 보낸 메시지들이 읽혔을 때
      markMessagesAsRead(data.messageIds)
    }

    // 상대방 퇴장 처리 (새로운 API)
    const handleUserLeft = (data: UserLeftData) => {
      // 내가 나간 경우와 상대방이 나간 경우 구분
      const currentUserLeft = (isLawyer && data.lawyerLeft) || (!isLawyer && data.userLeft)

      // 시스템 메시지 생성 및 상태 업데이트
      let messageContent = ''

      if (!data.chatRoomIsActive) {
        // 양쪽 모두 나간 경우 - 완전 종료
        messageContent = '채팅이 종료되었습니다.'
        setChatStatus('COMPLETED')
      } else if (currentUserLeft) {
        // 내가 나간 경우
        messageContent = '채팅을 나갔습니다. 상대방은 계속 메시지를 보낼 수 있습니다.'
        setChatStatus('COMPLETED')
      } else {
        // 상대방이 나간 경우 - 일방향 채팅 상태
        const leftUserType = data.userLeft ? '사용자' : '변호사'
        messageContent = `${leftUserType}가 채팅을 나갔습니다.`
        setChatStatus('PARTIAL_LEFT')
      }

      // 중복 메시지 방지: 같은 내용의 시스템 메시지가 이미 있는지 확인
      const currentMessages = useSocketStore.getState().messages
      const isDuplicateMessage = currentMessages.some(
        msg =>
          msg.chatMessageContent === messageContent &&
          msg.chatMessageSenderId === 0 &&
          Date.now() - new Date(msg.chatMessageCreatedAt).getTime() < 5000 // 5초 이내
      )

      if (!isDuplicateMessage) {
        const leaveMessage: ChatMessage = {
          chatMessageId: Date.now(),
          chatMessageContent: messageContent,
          chatMessageSenderType: 'LAWYER', // 시스템 메시지
          chatMessageSenderId: 0,
          chatMessageCreatedAt: new Date().toISOString(),
        }

        addMessage(leaveMessage)
      }
    }

    // 채팅방 퇴장 성공
    const handleLeaveRoomSuccess = (data: any) => {
      // API 문서에 따른 새로운 응답 형식 처리
      if (data && typeof data.chatRoomIsActive !== 'undefined') {
        // 내가 나간 경우와 상대방이 나간 경우 구분
        const currentUserLeft = (isLawyer && data.lawyerLeft) || (!isLawyer && data.userLeft)

        let messageContent = ''
        if (!data.chatRoomIsActive) {
          // 양쪽 모두 나간 경우 - 완전 종료
          messageContent = '채팅이 종료되었습니다.'
          setChatStatus('COMPLETED')
        } else if (currentUserLeft) {
          // 내가 나간 경우
          messageContent = '채팅을 나갔습니다. 상대방은 계속 메시지를 보낼 수 있습니다.'
          setChatStatus('COMPLETED')
        } else {
          // 상대방이 나간 경우 - 일방향 채팅 상태
          const leftUserType = data.userLeft ? '사용자' : '변호사'
          messageContent = `${leftUserType}가 채팅을 나갔습니다.`
          setChatStatus('PARTIAL_LEFT')
        }

        // 시스템 메시지 추가
        const leaveMessage: ChatMessage = {
          chatMessageId: Date.now(),
          chatMessageContent: messageContent,
          chatMessageSenderType: 'LAWYER', // 시스템 메시지
          chatMessageSenderId: 0,
          chatMessageCreatedAt: new Date().toISOString(),
        }

        addMessage(leaveMessage)
      } else {
        const leaveMessage: ChatMessage = {
          chatMessageId: Date.now(),
          chatMessageContent: '상대방이 채팅을 나갔습니다.',
          chatMessageSenderType: 'LAWYER',
          chatMessageSenderId: 0,
          chatMessageCreatedAt: new Date().toISOString(),
        }
        addMessage(leaveMessage)
        setChatStatus('PARTIAL_LEFT')
      }
    }

    // 채팅방 퇴장 실패
    const handleLeaveRoomError = (error: { message: string }) => {
      console.error('채팅방 퇴장 실패:', error.message)
    }

    // 사용자 상태 구독 응답 처리
    const handleUserStatusResponse = (data: any) => {
      console.log('👤 [SOCKET] 사용자 상태 응답:', data)
      // socketStore의 userStatuses 업데이트 로직 추가 가능
    }

    // 배치 사용자 상태 응답 처리
    const handleBatchUserStatusResponse = (data: any) => {
      console.log('👥 [SOCKET] 배치 사용자 상태 응답:', data)
      // socketStore의 userStatuses 업데이트 로직 추가 가능
    }

    // 사용자 상태 변경 이벤트 처리
    const handleUserStatusChanged = (data: any) => {
      console.log('🔄 [SOCKET] 사용자 상태 변경:', data)
      // socketStore의 userStatuses 업데이트 로직 추가 가능
    }

    // 채팅방 상태 변경 이벤트 처리
    const handleChatRoomStatusChanged = (data: {
      chatRoomId: number
      chatRoomStatus: ChatRoomStatus
      timestamp: string
    }) => {
      console.log('🔄 [SOCKET] 채팅방 상태 변경 이벤트:', data)

      // 현재 채팅방의 상태 변경인지 확인
      if (data.chatRoomId === chatRoomId) {
        setChatStatus(data.chatRoomStatus)
        console.log(`✅ [SOCKET] 채팅방 ${data.chatRoomId} 상태가 ${data.chatRoomStatus}로 변경됨`)
      }
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

    // 사용자 상태 관련 이벤트
    socket.on('userStatusResponse', handleUserStatusResponse)
    socket.on('batchUserStatusResponse', handleBatchUserStatusResponse)
    socket.on('userStatusChanged', handleUserStatusChanged)

    // 채팅방 상태 변경 이벤트
    socket.on('chatRoomStatusChanged', handleChatRoomStatusChanged)

    // 다른 가능한 나가기 이벤트 이름들도 리스닝
    socket.on('user_left', handleUserLeft)
    socket.on('userDisconnected', handleUserLeft)
    socket.on('memberLeft', handleUserLeft)
    socket.on('chatRoomLeft', handleUserLeft)
    socket.on('roomLeft', handleUserLeft)

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

      // 사용자 상태 관련 이벤트 정리
      socket.off('userStatusResponse', handleUserStatusResponse)
      socket.off('batchUserStatusResponse', handleBatchUserStatusResponse)
      socket.off('userStatusChanged', handleUserStatusChanged)

      // 채팅방 상태 변경 이벤트 정리
      socket.off('chatRoomStatusChanged', handleChatRoomStatusChanged)

      // 추가된 이벤트 리스너들도 정리
      socket.off('user_left')
      socket.off('userDisconnected')
      socket.off('memberLeft')
      socket.off('chatRoomLeft')
      socket.off('roomLeft')

      // timeout 정리
      timeoutRefs.current.forEach(timeoutId => {
        clearTimeout(timeoutId)
      })
      timeoutRefs.current.clear()
    }
  }, [
    socket,
    setMessages,
    setRoomInfo,
    setChatStatus,
    addMessage,
    updateMessage,
    updateMessageByTempId,
    markMessagesAsRead,
    chatRoomId,
    isLawyer,
  ])

  // 메시지 전송 함수
  const sendMessage = useCallback(
    (content: string, roomInfo: any) => {
      console.log('📤 [SOCKET] 메시지 전송 시도:', {
        content,
        socket: !!socket,
        connected: socket?.connected,
        chatRoomId,
        roomInfo: roomInfo ? '존재' : '없음',
      })

      if (socket && chatRoomId && socket.connected) {
        const tempId = `temp_${Date.now()}_${Math.random()}`

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
          status: 'sending',
        }

        console.log('📤 [SOCKET] 임시 메시지 추가:', tempMessage)
        addMessage(tempMessage)

        // 서버로 메시지 전송 (상태 변경은 서버에서 처리하도록)
        const messagePayload = {
          chatRoomId: chatRoomId,
          content: content,
          receiverId: isLawyer ? roomInfo?.chatRoomUserId || 0 : roomInfo?.chatRoomLawyerId || 0,
          receiverType: isLawyer ? 'USER' : 'LAWYER',
          tempId,
        }

        console.log('📤 [SOCKET] 서버로 메시지 전송:', messagePayload)
        socket.emit('sendMessage', messagePayload)

        // 변호사가 PENDING 상태에서 첫 메시지를 보낼 때 CONSULTING으로 상태 변경 (메시지 전송 후)
        if (isLawyer && currentChatStatus === 'PENDING') {
          console.log('🔄 [STATUS] 채팅방 상태 변경 시도: PENDING -> CONSULTING')
          // 약간의 지연을 두어 메시지 전송이 완료된 후 상태 변경
          setTimeout(() => {
            console.log('🔄 [STATUS] updateChatRoomStatus 호출')
            updateChatRoomStatus({
              chatRoomId: chatRoomId,
              status: 'CONSULTING',
            })
          }, 100)
        }
      } else {
        console.error('❌ [SOCKET] 메시지 전송 실패 - 조건 미충족:', {
          socket: !!socket,
          connected: socket?.connected,
          chatRoomId,
        })
      }
    },
    [socket, chatRoomId, isLawyer, userId, addMessage, currentChatStatus, updateChatRoomStatus]
  )

  // 채팅방 나가기 함수
  const leaveRoom = useCallback(() => {
    if (socket && chatRoomId) {
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
