import { create } from 'zustand'
import { Socket } from 'socket.io-client'
import { ChatMessage, ChatRoomStatus } from '@/types/baroTalkTypes'

interface SocketState {
  // 소켓 연결 상태
  socket: Socket | null
  isConnected: boolean

  // 채팅방 상태
  chatRoomId: number | null
  messages: ChatMessage[]
  chatStatus: ChatRoomStatus
  roomInfo: any

  // 사용자 온라인 상태
  userStatuses: Record<number, string>
}

interface SocketActions {
  // 소켓 관련 액션
  setSocket: (_socket: Socket | null) => void
  setConnected: (_isConnected: boolean) => void

  // 채팅방 관련 액션
  setChatRoomId: (_chatRoomId: number | null) => void
  setMessages: (_messages: ChatMessage[]) => void
  addMessage: (_message: ChatMessage) => void
  setChatStatus: (_status: ChatRoomStatus) => void
  setRoomInfo: (_roomInfo: any) => void

  // 사용자 상태 관련 액션
  updateUserStatus: (_userId: number, _status: string) => void
  updateBatchUserStatus: (_statuses: Record<number, string>) => void

  // 초기화
  resetChatRoom: () => void
}

type SocketStore = SocketState & SocketActions

export const useSocketStore = create<SocketStore>((set, _get) => ({
  // 초기 상태
  socket: null,
  isConnected: false,
  chatRoomId: null,
  messages: [],
  chatStatus: 'PENDING',
  roomInfo: null,
  userStatuses: {},

  // 소켓 관련 액션
  setSocket: socket => {
    set({ socket })
  },

  setConnected: isConnected => {
    set({ isConnected })
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

  setChatStatus: chatStatus => {
    set({ chatStatus })
  },

  setRoomInfo: roomInfo => {
    set({ roomInfo })
  },

  // 사용자 상태 관련 액션
  updateUserStatus: (userId, status) => {
    set(state => ({
      userStatuses: {
        ...state.userStatuses,
        [userId]: status,
      },
    }))
  },

  updateBatchUserStatus: statuses => {
    set(state => ({
      userStatuses: {
        ...state.userStatuses,
        ...statuses,
      },
    }))
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
}))

// 선택적 구독을 위한 셀렉터들
export const useSocket = () => useSocketStore(state => state.socket)
export const useIsConnected = () => useSocketStore(state => state.isConnected)
export const useChatRoomId = () => useSocketStore(state => state.chatRoomId)
export const useMessages = () => useSocketStore(state => state.messages)
export const useChatStatus = () => useSocketStore(state => state.chatStatus)
export const useRoomInfo = () => useSocketStore(state => state.roomInfo)
export const useUserStatuses = () => useSocketStore(state => state.userStatuses)

// 개별 액션들 (안정적인 참조)
export const useSetSocket = () => useSocketStore(state => state.setSocket)
export const useSetConnected = () => useSocketStore(state => state.setConnected)
export const useSetChatRoomId = () => useSocketStore(state => state.setChatRoomId)
export const useSetMessages = () => useSocketStore(state => state.setMessages)
export const useAddMessage = () => useSocketStore(state => state.addMessage)
export const useSetChatStatus = () => useSocketStore(state => state.setChatStatus)
export const useSetRoomInfo = () => useSocketStore(state => state.setRoomInfo)
export const useUpdateUserStatus = () => useSocketStore(state => state.updateUserStatus)
export const useUpdateBatchUserStatus = () => useSocketStore(state => state.updateBatchUserStatus)
export const useResetChatRoom = () => useSocketStore(state => state.resetChatRoom)

// 액션들 (하위 호환성)
export const useSocketActions = () =>
  useSocketStore(state => ({
    setSocket: state.setSocket,
    setConnected: state.setConnected,
    setChatRoomId: state.setChatRoomId,
    setMessages: state.setMessages,
    addMessage: state.addMessage,
    setChatStatus: state.setChatStatus,
    setRoomInfo: state.setRoomInfo,
    updateUserStatus: state.updateUserStatus,
    updateBatchUserStatus: state.updateBatchUserStatus,
    resetChatRoom: state.resetChatRoom,
  }))
