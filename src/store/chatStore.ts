import { create } from 'zustand'
import { ChatMessage, ChatRoomStatus } from '@/types/baroTalkTypes'

interface ChatState {
  // 채팅방 정보
  chatRoomId: number | null
  roomInfo: any | null
  messages: ChatMessage[]
  chatStatus: ChatRoomStatus

  // 소켓 연결 상태
  isConnected: boolean

  // 액션들
  setChatRoomId: (chatRoomId: number | null) => void
  setRoomInfo: (roomInfo: any) => void
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  setChatStatus: (status: ChatRoomStatus) => void
  setIsConnected: (connected: boolean) => void
  resetChat: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  // 초기 상태
  chatRoomId: null,
  roomInfo: null,
  messages: [],
  chatStatus: 'PENDING',
  isConnected: false,

  // 액션들
  setChatRoomId: chatRoomId => set({ chatRoomId }),

  setRoomInfo: roomInfo => set({ roomInfo }),

  setMessages: messages => set({ messages }),

  addMessage: message => {
    const { messages } = get()
    set({ messages: [...messages, message] })
  },

  setChatStatus: chatStatus => set({ chatStatus }),

  setIsConnected: isConnected => set({ isConnected }),

  resetChat: () =>
    set({
      chatRoomId: null,
      roomInfo: null,
      messages: [],
      chatStatus: 'PENDING',
      isConnected: false,
    }),
}))
