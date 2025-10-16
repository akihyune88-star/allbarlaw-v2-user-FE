import { create } from 'zustand'
import { Socket } from 'socket.io-client'
import { ChatMessage, ChatRoomStatus } from '@/types/baroTalkTypes'

interface SocketState {
  // 소켓 연결 상태
  socket: Socket | null
  isConnected: boolean

  // 재연결 관련 상태
  isReconnecting: boolean
  reconnectAttempts: number
  lastDisconnectTime: number | null
  reconnectInterval: number | null

  // 채팅방 상태
  chatRoomId: number | null
  messages: ChatMessage[]
  chatStatus: ChatRoomStatus
  roomInfo: any

  // 사용자 온라인 상태
  userStatuses: Record<number, string>

  // 채팅방별 메시지 캐시 (선택적)
  messageCache: Record<number, ChatMessage[]>
}

interface SocketActions {
  // 소켓 관련 액션
  setSocket: (_socket: Socket | null) => void
  setConnected: (_isConnected: boolean) => void

  // 재연결 관련 액션
  setReconnecting: (_isReconnecting: boolean) => void
  setReconnectAttempts: (_attempts: number) => void
  setLastDisconnectTime: (_time: number | null) => void
  setReconnectInterval: (_interval: number | null) => void
  incrementReconnectAttempts: () => void
  resetReconnectState: () => void

  // 채팅방 관련 액션
  setChatRoomId: (_chatRoomId: number | null) => void
  setMessages: (_messages: ChatMessage[]) => void
  addMessage: (_message: ChatMessage) => void
  updateMessage: (_messageId: number, _updates: Partial<ChatMessage>) => void
  updateMessageByTempId: (_tempId: string, _updates: Partial<ChatMessage>) => void
  markMessagesAsRead: (_messageIds: number[]) => void
  setChatStatus: (_status: ChatRoomStatus) => void
  setRoomInfo: (_roomInfo: any) => void

  // 사용자 상태 관련 액션
  updateUserStatus: (_userId: number, _status: string) => void
  updateBatchUserStatus: (_statuses: Record<number, string>) => void

  // 메시지 캐시 관련 액션
  setMessagesForRoom: (_roomId: number, _messages: ChatMessage[]) => void
  addMessageToRoom: (_roomId: number, _message: ChatMessage) => void
  getMessagesForRoom: (_roomId: number) => ChatMessage[]

  // 초기화
  resetChatRoom: () => void
  clearMessageCache: () => void
}

type SocketStore = SocketState & SocketActions

export const useSocketStore = create<SocketStore>((set, get) => ({
  // 초기 상태
  socket: null,
  isConnected: false,
  isReconnecting: false,
  reconnectAttempts: 0,
  lastDisconnectTime: null,
  reconnectInterval: null,
  chatRoomId: null,
  messages: [],
  chatStatus: 'PENDING',
  roomInfo: null,
  userStatuses: {},
  messageCache: {},

  // 소켓 관련 액션
  setSocket: socket => {
    set({ socket })
  },

  setConnected: isConnected => {
    set({ isConnected })
  },

  // 재연결 관련 액션
  setReconnecting: isReconnecting => {
    set({ isReconnecting })
  },

  setReconnectAttempts: reconnectAttempts => {
    set({ reconnectAttempts })
  },

  setLastDisconnectTime: lastDisconnectTime => {
    set({ lastDisconnectTime })
  },

  setReconnectInterval: reconnectInterval => {
    set({ reconnectInterval })
  },

  incrementReconnectAttempts: () => {
    set(state => ({ reconnectAttempts: state.reconnectAttempts + 1 }))
  },

  resetReconnectState: () => {
    set({
      isReconnecting: false,
      reconnectAttempts: 0,
      lastDisconnectTime: null,
      reconnectInterval: null,
    })
  },

  // 채팅방 관련 액션
  setChatRoomId: chatRoomId => {
    set({ chatRoomId })
  },

  setMessages: messages => {
    set({ messages })
  },

  addMessage: message => {
    set(state => ({
      messages: [...state.messages, message],
    }))
  },

  updateMessage: (messageId, updates) => {
    set(state => ({
      messages: state.messages.map(msg => (msg.chatMessageId === messageId ? { ...msg, ...updates } : msg)),
    }))
  },

  updateMessageByTempId: (tempId, updates) => {
    set(state => ({
      messages: state.messages.map(msg => (msg.tempId === tempId ? { ...msg, ...updates } : msg)),
    }))
  },

  markMessagesAsRead: messageIds => {
    set(state => ({
      messages: state.messages.map(msg =>
        messageIds.includes(msg.chatMessageId) ? { ...msg, chatMessageIsRead: true } : msg
      ),
    }))
  },

  setChatStatus: chatStatus => {
    set({ chatStatus })
  },

  setRoomInfo: roomInfo => {
    set({ roomInfo })
  },

  // 사용자 상태 관련 액션
  updateUserStatus: (userId, status) => {
    console.log('🔍 socketStore - 변호사 상태 업데이트:', { userId, status, type: typeof userId })
    set(state => {
      const newState = {
        userStatuses: {
          ...state.userStatuses,
          [userId]: status,
        },
      }
      console.log('🔍 socketStore - 변호사 상태 저장됨:', {
        before: state.userStatuses,
        after: newState.userStatuses,
        updatedKey: userId,
        updatedValue: status,
      })
      return newState
    })
  },

  updateBatchUserStatus: statuses => {
    console.log('🔍 socketStore - 변호사 상태 배치 업데이트:', statuses)
    set(state => {
      const newState = {
        userStatuses: {
          ...state.userStatuses,
          ...statuses,
        },
      }
      console.log('🔍 socketStore - 변호사 상태 배치 저장됨:', {
        before: state.userStatuses,
        after: newState.userStatuses,
        batchData: statuses,
      })
      return newState
    })
  },

  // 메시지 캐시 관련 액션
  setMessagesForRoom: (roomId, messages) => {
    set(state => ({
      messageCache: {
        ...state.messageCache,
        [roomId]: messages,
      },
    }))
  },

  addMessageToRoom: (roomId, message) => {
    set(state => ({
      messageCache: {
        ...state.messageCache,
        [roomId]: [...(state.messageCache[roomId] || []), message],
      },
    }))
  },

  getMessagesForRoom: roomId => {
    return get().messageCache[roomId] || []
  },

  // 초기화
  resetChatRoom: () => {
    set({
      chatRoomId: null,
      messages: [],
      chatStatus: 'PENDING',
      roomInfo: null,
    })
  },

  clearMessageCache: () => {
    set({ messageCache: {} })
  },
}))

// 선택적 구독을 위한 셀렉터들
export const useSocket = () => useSocketStore(state => state.socket)
export const useIsConnected = () => useSocketStore(state => state.isConnected)
export const useIsReconnecting = () => useSocketStore(state => state.isReconnecting)
export const useReconnectAttempts = () => useSocketStore(state => state.reconnectAttempts)
export const useLastDisconnectTime = () => useSocketStore(state => state.lastDisconnectTime)
export const useChatRoomId = () => useSocketStore(state => state.chatRoomId)
export const useMessages = () => useSocketStore(state => state.messages)
export const useChatStatus = () => useSocketStore(state => state.chatStatus)
export const useRoomInfo = () => useSocketStore(state => state.roomInfo)
export const useUserStatuses = () => useSocketStore(state => state.userStatuses)

// 개별 액션들 (안정적인 참조)
export const useSetSocket = () => useSocketStore(state => state.setSocket)
export const useSetConnected = () => useSocketStore(state => state.setConnected)
export const useSetReconnecting = () => useSocketStore(state => state.setReconnecting)
export const useSetReconnectAttempts = () => useSocketStore(state => state.setReconnectAttempts)
export const useSetLastDisconnectTime = () => useSocketStore(state => state.setLastDisconnectTime)
export const useSetReconnectInterval = () => useSocketStore(state => state.setReconnectInterval)
export const useIncrementReconnectAttempts = () => useSocketStore(state => state.incrementReconnectAttempts)
export const useResetReconnectState = () => useSocketStore(state => state.resetReconnectState)
export const useSetChatRoomId = () => useSocketStore(state => state.setChatRoomId)
export const useSetMessages = () => useSocketStore(state => state.setMessages)
export const useAddMessage = () => useSocketStore(state => state.addMessage)
export const useUpdateMessage = () => useSocketStore(state => state.updateMessage)
export const useUpdateMessageByTempId = () => useSocketStore(state => state.updateMessageByTempId)
export const useMarkMessagesAsRead = () => useSocketStore(state => state.markMessagesAsRead)
export const useSetChatStatus = () => useSocketStore(state => state.setChatStatus)
export const useSetRoomInfo = () => useSocketStore(state => state.setRoomInfo)
export const useUpdateUserStatus = () => useSocketStore(state => state.updateUserStatus)
export const useUpdateBatchUserStatus = () => useSocketStore(state => state.updateBatchUserStatus)
export const useResetChatRoom = () => useSocketStore(state => state.resetChatRoom)

// 메시지 캐시 관련 액션들
export const useSetMessagesForRoom = () => useSocketStore(state => state.setMessagesForRoom)
export const useAddMessageToRoom = () => useSocketStore(state => state.addMessageToRoom)
export const useGetMessagesForRoom = () => useSocketStore(state => state.getMessagesForRoom)
export const useClearMessageCache = () => useSocketStore(state => state.clearMessageCache)

// 액션들 (하위 호환성)
export const useSocketActions = () =>
  useSocketStore(state => ({
    setSocket: state.setSocket,
    setConnected: state.setConnected,
    setReconnecting: state.setReconnecting,
    setReconnectAttempts: state.setReconnectAttempts,
    setLastDisconnectTime: state.setLastDisconnectTime,
    setReconnectInterval: state.setReconnectInterval,
    incrementReconnectAttempts: state.incrementReconnectAttempts,
    resetReconnectState: state.resetReconnectState,
    setChatRoomId: state.setChatRoomId,
    setMessages: state.setMessages,
    addMessage: state.addMessage,
    setChatStatus: state.setChatStatus,
    setRoomInfo: state.setRoomInfo,
    updateUserStatus: state.updateUserStatus,
    updateBatchUserStatus: state.updateBatchUserStatus,
    resetChatRoom: state.resetChatRoom,
    setMessagesForRoom: state.setMessagesForRoom,
    addMessageToRoom: state.addMessageToRoom,
    getMessagesForRoom: state.getMessagesForRoom,
    clearMessageCache: state.clearMessageCache,
  }))
