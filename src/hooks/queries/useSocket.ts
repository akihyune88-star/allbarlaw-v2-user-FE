import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChatMessage, ChatRoomStatus } from '@/types/baroTalkTypes'
import { Socket } from 'socket.io-client'
import { useCallback } from 'react'

// 소켓 연결 상태 관리
export const useSocketConnection = () => {
  const queryClient = useQueryClient()

  const { data: isConnected = false } = useQuery({
    queryKey: ['socket', 'connection'],
    queryFn: () => false,
    staleTime: Infinity,
    placeholderData: previousData => previousData,
  })

  const setConnected = useCallback(
    (connected: boolean) => {
      queryClient.setQueryData(['socket', 'connection'], connected)
    },
    [queryClient]
  )

  return { isConnected, setConnected }
}

// 채팅방 ID 관리
export const useChatRoomId = () => {
  const queryClient = useQueryClient()

  const { data: chatRoomId = null } = useQuery({
    queryKey: ['chat', 'currentRoomId'],
    queryFn: () => null as number | null,
    staleTime: Infinity,
    placeholderData: previousData => previousData,
  })

  const setChatRoomId = useCallback(
    (roomId: number | null) => {
      console.log('🟢 useChatRoomId: setChatRoomId 호출됨:', roomId)
      queryClient.setQueryData(['chat', 'currentRoomId'], roomId)
    },
    [queryClient]
  )

  return { chatRoomId, setChatRoomId }
}

// 채팅방별 메시지 관리
export const useChatMessages = (chatRoomId: number | null) => {
  const queryClient = useQueryClient()

  const { data: messages = [] } = useQuery({
    queryKey: ['chat', 'messages', chatRoomId],
    queryFn: () => [],
    staleTime: Infinity,
    placeholderData: previousData => previousData,
    enabled: !!chatRoomId,
  })

  const addMessage = useCallback(
    (message: ChatMessage) => {
      if (!chatRoomId) return

      queryClient.setQueryData(['chat', 'messages', chatRoomId], (old: ChatMessage[] = []) => [...old, message])
    },
    [chatRoomId, queryClient]
  )

  const setMessages = useCallback(
    (newMessages: ChatMessage[]) => {
      if (!chatRoomId) return

      queryClient.setQueryData(['chat', 'messages', chatRoomId], newMessages)
    },
    [chatRoomId, queryClient]
  )

  return { messages, addMessage, setMessages }
}

// 채팅방 상태 관리
export const useChatStatus = (chatRoomId: number | null) => {
  const queryClient = useQueryClient()

  const { data: chatStatus = 'PENDING' as ChatRoomStatus } = useQuery({
    queryKey: ['chat', 'status', chatRoomId],
    queryFn: () => 'PENDING' as ChatRoomStatus,
    staleTime: Infinity,
    placeholderData: previousData => previousData,
    enabled: !!chatRoomId,
  })

  const setChatStatus = useCallback(
    (status: ChatRoomStatus) => {
      if (!chatRoomId) return

      queryClient.setQueryData(['chat', 'status', chatRoomId], status)
    },
    [chatRoomId, queryClient]
  )

  return { chatStatus, setChatStatus }
}

// 채팅방 정보 관리
export const useChatRoomInfo = (chatRoomId: number | null) => {
  const queryClient = useQueryClient()

  const { data: roomInfo = null } = useQuery({
    queryKey: ['chat', 'roomInfo', chatRoomId],
    queryFn: () => null,
    staleTime: Infinity,
    placeholderData: previousData => previousData,
    enabled: !!chatRoomId,
  })

  const setRoomInfo = useCallback(
    (info: any) => {
      if (!chatRoomId) return

      queryClient.setQueryData(['chat', 'roomInfo', chatRoomId], info)
    },
    [chatRoomId, queryClient]
  )

  return { roomInfo, setRoomInfo }
}

// 사용자 온라인 상태 관리 (전체)
export const useUserStatuses = () => {
  const queryClient = useQueryClient()

  const { data: userStatuses = {} } = useQuery({
    queryKey: ['users', 'statuses'],
    queryFn: () => ({}),
    staleTime: Infinity,
    placeholderData: previousData => previousData,
  })

  const updateUserStatus = useCallback(
    (userId: number, status: 'online' | 'offline' | 'away') => {
      queryClient.setQueryData(['users', 'statuses'], (old: Record<number, string> = {}) => ({
        ...old,
        [userId]: status,
      }))
    },
    [queryClient]
  )

  const updateBatchUserStatus = useCallback(
    (statuses: Record<number, string>) => {
      queryClient.setQueryData(['users', 'statuses'], (old: Record<number, string> = {}) => ({
        ...old,
        ...statuses,
      }))
    },
    [queryClient]
  )

  return { userStatuses, updateUserStatus, updateBatchUserStatus }
}

// 소켓 인스턴스 관리
export const useSocketInstance = () => {
  const queryClient = useQueryClient()

  const { data: socket = null } = useQuery({
    queryKey: ['socket', 'instance'],
    queryFn: () => null as Socket | null,
    staleTime: Infinity,
    placeholderData: previousData => previousData,
  })

  const setSocket = useCallback(
    (newSocket: Socket | null) => {
      queryClient.setQueryData(['socket', 'instance'], newSocket)
    },
    [queryClient]
  )

  return { socket, setSocket }
}
