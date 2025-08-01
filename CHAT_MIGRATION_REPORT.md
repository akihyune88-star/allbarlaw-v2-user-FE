# 채팅 시스템 구현 및 React Query 마이그레이션 보고서

## 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [초기 채팅 시스템 설계](#초기-채팅-시스템-설계)
3. [상태 관리 진화 과정](#상태-관리-진화-과정)
4. [React Query 마이그레이션](#react-query-마이그레이션)
5. [실시간 채팅 구현](#실시간-채팅-구현)
6. [변호사 관리 시스템](#변호사-관리-시스템)
7. [API 서비스 및 타입 정의](#api-서비스-및-타입-정의)
8. [문제 해결 과정](#문제-해결-과정)
9. [최종 아키텍처](#최종-아키텍처)

## 프로젝트 개요

### 기술 스택

- **Frontend**: React 18, TypeScript, Vite
- **상태 관리**: React Query (TanStack Query)
- **실시간 통신**: Socket.IO
- **스타일링**: SCSS Modules
- **라우팅**: React Router v6

### 주요 기능

- 실시간 채팅 (사용자 ↔ 변호사)
- 변호사 관리 시스템
- 채팅방 상태 관리 (PENDING, ACTIVE, COMPLETED)
- 무한 스크롤 채팅 목록
- 온라인 상태 표시

## 초기 채팅 시스템 설계

### 1. 기본 컴포넌트 구조

#### Chat.tsx (초기 버전)

```typescript
// src/pages/baroTalk/chat/Chat.tsx
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '@/contexts/AuthContext'

const Chat = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [chatRoomId, setChatRoomId] = useState<number | null>(null)
  const { getUserIdFromToken } = useAuth()

  useEffect(() => {
    const userId = getUserIdFromToken()
    if (!userId) return

    const newSocket = io(import.meta.env.VITE_SERVER_API + '/chat', {
      auth: {
        token: localStorage.getItem('accessToken') || '',
      },
    })

    setSocket(newSocket)

    newSocket.on('connect', () => {
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [getUserIdFromToken])

  return (
    <main className='chat-container'>
      {chatRoomId && <ChatRoomContainer chatRoomId={chatRoomId} socket={socket} isConnected={isConnected} />}
      <ChatList onChatRoomClick={setChatRoomId} />
    </main>
  )
}
```

#### ChatRoomContainer.tsx

```typescript
// src/container/baroTalk/chatRoomContainer/ChatRoomContainer.tsx
interface ChatRoomContainerProps {
  chatRoomId: number
  socket: Socket | null
  isConnected: boolean
}

const ChatRoomContainer = ({ chatRoomId, socket, isConnected }: ChatRoomContainerProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [roomInfo, setRoomInfo] = useState<ChatRoom | null>(null)

  useEffect(() => {
    if (chatRoomId && socket && isConnected) {
      socket.emit('joinRoom', { chatRoomId })
    }
  }, [chatRoomId, socket, isConnected])

  const handleSendMessage = (content: string) => {
    if (socket && chatRoomId) {
      socket.emit('sendMessage', {
        chatRoomId,
        content,
        receiverId: roomInfo?.chatRoomLawyerId || 0,
        receiverType: 'LAWYER',
        tempId: `temp_${Date.now()}`,
      })
    }
  }

  return (
    <section className='chat-content'>
      <ChatHeader roomInfo={roomInfo} />
      <ChatBody messages={messages} onSendMessage={handleSendMessage} isConnected={isConnected} />
    </section>
  )
}
```

### 2. 초기 상태 관리 방식

#### Session Storage 기반 관리

```typescript
// src/utils/baroTalkSession.ts
export const baroTalkSession = {
  setSession: (data: BaroTalkSessionData) => {
    sessionStorage.setItem('baroTalkSession', JSON.stringify(data))
  },

  getSession: (): BaroTalkSessionData | null => {
    const session = sessionStorage.getItem('baroTalkSession')
    return session ? JSON.parse(session) : null
  },

  clearSession: () => {
    sessionStorage.removeItem('baroTalkSession')
  },
}
```

#### Zustand Store (1차 개선)

```typescript
// src/store/baroTalkStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BaroTalkStore {
  sessionData: BaroTalkSessionData | null
  setSessionData: (data: BaroTalkSessionData) => void
  clearSessionData: () => void
}

export const useBaroTalkStore = create<BaroTalkStore>()(
  persist(
    set => ({
      sessionData: null,
      setSessionData: data => set({ sessionData: data }),
      clearSessionData: () => set({ sessionData: null }),
    }),
    {
      name: 'baroTalk-storage',
    }
  )
)
```

## 상태 관리 진화 과정

### 1단계: Session Storage → Zustand

**문제점:**

- Session Storage는 단순한 key-value 저장
- 타입 안정성 부족
- 상태 변경 추적 어려움

**개선사항:**

- Zustand로 상태 관리 중앙화
- persist 미들웨어로 자동 저장
- 타입 안정성 확보

### 2단계: Zustand → React Query

**문제점:**

- 채팅 상태가 복잡해짐 (메시지, 연결 상태, 채팅방 정보 등)
- 실시간 업데이트 시 성능 이슈
- 컴포넌트별 상태 동기화 어려움

**개선사항:**

- React Query로 서버 상태 관리
- 캐싱 및 백그라운드 업데이트
- 낙관적 업데이트 지원

## React Query 마이그레이션

### 1. 기본 React Query 설정

#### QueryClient 설정

```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분
      retry: 1,
    },
  },
})
```

#### Provider 설정

```typescript
// src/main.tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
```

### 2. 소켓 상태 관리 훅

#### useSocket.ts

```typescript
// src/hooks/queries/useSocket.ts
import { useQuery, useQueryClient } from '@tanstack/react-query'
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
      queryClient.setQueryData(['chat', 'currentRoomId'], roomId)
    },
    [queryClient]
  )

  return { chatRoomId, setChatRoomId }
}
```

### 3. 채팅 메시지 관리

#### useChatMessages.ts

```typescript
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
```

### 4. 채팅방 상태 관리

#### useChatStatus.ts

```typescript
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
```

## 실시간 채팅 구현

### 1. Socket.IO 이벤트 처리

#### ChatRoomContainer.tsx (개선된 버전)

```typescript
// src/container/baroTalk/chatRoomContainer/ChatRoomContainer.tsx
import { useChatMessages, useChatStatus, useChatRoomInfo } from '@/hooks/queries/useSocket'

const ChatRoomContainer = ({ chatRoomId, socket, isConnected }: ChatRoomContainerProps) => {
  const { messages, addMessage, setMessages } = useChatMessages(chatRoomId)
  const { chatStatus, setChatStatus } = useChatStatus(chatRoomId)
  const { roomInfo, setRoomInfo } = useChatRoomInfo(chatRoomId)

  // 채팅방 입장
  useEffect(() => {
    if (chatRoomId && socket && isConnected) {
      const joinRoomRequest: JoinRoomRequest = {
        chatRoomId: chatRoomId,
        loadRecentMessages: true,
        messageLimit: 50,
      }

      socket.emit('joinRoom', joinRoomRequest)
    }
  }, [chatRoomId, socket, isConnected])

  // 소켓 이벤트 리스너
  useEffect(() => {
    if (!socket) return

    const handleJoinRoomSuccess = (data: JoinRoomSuccessData) => {
      setMessages(data.recentMessages)
      setRoomInfo(data.chatRoom)
      setChatStatus(data.chatRoom.chatRoomStatus)
    }

    const handleNewMessage = (message: ChatMessage) => {
      addMessage(message)
    }

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

    socket.on('joinRoomSuccess', handleJoinRoomSuccess)
    socket.on('newMessage', handleNewMessage)
    socket.on('userLeft', handleUserLeft)

    return () => {
      socket.off('joinRoomSuccess', handleJoinRoomSuccess)
      socket.off('newMessage', handleNewMessage)
      socket.off('userLeft', handleUserLeft)
    }
  }, [socket, setMessages, setRoomInfo, setChatStatus, addMessage])

  // 메시지 전송
  const handleSendMessage = useCallback(
    (content: string) => {
      if (socket && chatRoomId && isConnected) {
        socket.emit('sendMessage', {
          chatRoomId: chatRoomId,
          content: content,
          receiverId: isLawyer ? roomInfo?.chatRoomUserId || 0 : roomInfo?.chatRoomLawyerId || 0,
          receiverType: isLawyer ? 'USER' : 'LAWYER',
          tempId: `temp_${Date.now()}`,
        })
      }
    },
    [socket, chatRoomId, isConnected, roomInfo]
  )

  return (
    <section className='chat-content'>
      <ChatHeader roomInfo={roomInfo} onEndChat={handleEndChat} />
      <ChatBody
        chatRoomId={chatRoomId}
        chatStatus={chatStatus}
        messages={messages}
        onSendMessage={handleSendMessage}
        isConnected={isConnected}
        type={isLawyer ? 'LAWYER' : 'USER'}
      />
    </section>
  )
}
```

### 2. 채팅 UI 컴포넌트

#### ChatBody.tsx

```typescript
// src/container/baroTalk/chatBody/ChatBody.tsx
const ChatBody = ({ chatStatus, messages, onSendMessage, isConnected, type = 'USER', chatRoomId }: ChatBodyProps) => {
  const [message, setMessage] = useState('')
  const { chatStatus: globalChatStatus } = useChatStatus(chatRoomId)

  const handleSendMessage = () => {
    if (message.trim() && isConnected) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const currentChatStatus = globalChatStatus || chatStatus

  return (
    <>
      <div className={styles.chatBody}>
        {messages.length === 0 ? (
          <div className={styles['empty-messages']}>
            <p>아직 메시지가 없습니다.</p>
            <p>첫 번째 메시지를 보내보세요!</p>
          </div>
        ) : (
          messages.map(msg => {
            const isSystemMessage =
              msg.chatMessageSenderId === 0 &&
              (msg.chatMessageContent.includes('상담을 종료했습니다') || msg.chatMessageContent.includes('나갔습니다'))

            if (isSystemMessage) {
              return (
                <div key={msg.chatMessageId} className={styles['system-message']}>
                  <span className={styles['system-message-text']}>{msg.chatMessageContent}</span>
                  <span className={styles['system-message-time']}>{formatTimeAgo(msg.chatMessageCreatedAt)}</span>
                </div>
              )
            }

            return (
              <ChatBubble
                key={msg.chatMessageId}
                message={msg.chatMessageContent}
                direction={msg.chatMessageSenderType === 'USER' ? 'right' : 'left'}
                color={msg.chatMessageSenderType === 'USER' ? COLOR.green_01 : COLOR.white}
                colorText={msg.chatMessageSenderType === 'USER' ? COLOR.white : COLOR.black}
                profileImage={msg.chatMessageSenderType === 'LAWYER' ? 'https://picsum.photos/200/300' : undefined}
              >
                <div>
                  <span>{formatTimeAgo(msg.chatMessageCreatedAt)}</span>
                </div>
              </ChatBubble>
            )
          })
        )}
      </div>

      {currentChatStatus === 'ACTIVE' || type === 'LAWYER' ? (
        <InputBox
          icon={<SvgIcon name='send' />}
          value={message}
          onChange={handleChangeMessage}
          onKeyDown={handleKeyPress}
          onIconClick={handleSendMessage}
          className={styles['chat-input']}
          style={type === 'LAWYER' ? { height: '3rem', minHeight: '3rem' } : undefined}
        />
      ) : (
        <ChatWaitingBlogList chatStatus={currentChatStatus} chatRoomId={chatRoomId} />
      )}
    </>
  )
}
```

## 변호사 관리 시스템

### 1. 라우터 구조

#### index.tsx

```typescript
// src/routes/index.tsx
{
  path: ROUTER.LAWYER_ADMIN,
  element: (
    <ProtectedRoute requireLawyer={true}>
      <LawyerAdminLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '',
      element: <div>변호사 관리 메인 페이지</div>,
    },
    {
      path: 'chat',
      element: <LawyerChat />,
    },
  ],
}
```

### 2. 변호사 관리 레이아웃

#### LawyerAdminLayout.tsx

```typescript
// src/pages/lawyerAdmin/LawyerAdminLayout.tsx
import SideBar from '@/components/sideBar/SideBar'
import LawyerAdminHeader from '@/container/lawyerAdmin/lawyerAdminHeader/LawyerAdminHeader'
import Footer from '@/components/footer/Footer'
import { Outlet, useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'

const LawyerAdminLayout = () => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null)
  const navigate = useNavigate()

  const handleMainCategoryClick = (id: number) => {
    setSelectedMainCategory(selectedMainCategory === id ? null : id)
  }

  const handleSubcategoryClick = (id: number) => {
    setSelectedSubcategory(id)
    if (id === 1) {
      navigate(ROUTER.LAWYER_ADMIN_CHAT)
    }
  }

  return (
    <div className={styles.container}>
      <LawyerAdminHeader />
      <div className={styles['inner-container']} style={{ display: 'flex' }}>
        <SideBar
          categories={categories}
          selectedMainCategory={selectedMainCategory}
          selectedSubcategory={selectedSubcategory}
          onMainCategoryClick={handleMainCategoryClick}
          onSubcategoryClick={handleSubcategoryClick}
          alwaysExpanded={true}
        />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

const categories: CategoryList = [
  {
    categoryId: 1,
    categoryName: '채팅상담',
    imageUrl: '',
    clickedImageUrl: '',
    isUncategorized: false,
    subcategories: [
      {
        subcategoryId: 1,
        subcategoryName: '채팅리스트',
        isUncategorized: false,
        categoryId: 1,
      },
    ],
  },
]
```

### 3. 변호사 채팅 페이지

#### LawyerChat.tsx

```typescript
// src/pages/lawyerAdmin/chat/lawyerChat/LawyerChat.tsx
const LawyerChat = () => {
  const [testChatRoomId, setTestChatRoomId] = useState<string>('')

  const { socket } = useSocketInstance()
  const { isConnected } = useSocketConnection()
  const { chatRoomId, setChatRoomId } = useChatRoomId()

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

      {chatRoomId && <ChatRoomContainer chatRoomId={chatRoomId} socket={socket} isConnected={isConnected} />}
    </main>
  )
}
```

## API 서비스 및 타입 정의

### 1. API 서비스 구조

#### baroTalkServices.ts

```typescript
// src/services/baroTalkServices.ts
import instance from '@/lib/axios'
import {
  CreateBaroTalkRequest,
  BaroTalkLawyerListRequest,
  BaroTalkLawyerListResponse,
  BaroTalkChatListRequest,
  BaroTalkChatListResponse,
  UpdateChatRoomStatusRequest,
  UpdateChatRoomStatusResponse,
} from '@/types/baroTalkTypes'

export const baroTalkServices = {
  // 바로톡 생성
  createBaroTalk: async (request: CreateBaroTalkRequest) => {
    const response = await instance.post('/baro-talk', request)
    return response.data
  },

  // 추천 변호사 목록 조회 (무한 스크롤)
  getBaroTalkLawyerList: async (request: BaroTalkLawyerListRequest) => {
    const response = await instance.get<BaroTalkLawyerListResponse>('/baro-talk/lawyers', {
      params: request,
    })
    return response.data
  },

  // 채팅방 목록 조회 (무한 스크롤)
  getBaroTalkChatList: async (request: BaroTalkChatListRequest) => {
    const response = await instance.get<BaroTalkChatListResponse>('/baro-talk/chat-list', {
      params: request,
    })
    return response.data
  },

  // 채팅방 상태 업데이트
  updateChatRoomStatus: async (userId: number, request: UpdateChatRoomStatusRequest) => {
    const response = await instance.post<UpdateChatRoomStatusResponse>(`/chat/${request.chatRoomId}/status`, {
      status: request.status,
      userId,
    })
    return response.data
  },
}
```

#### lawyerService.ts

```typescript
// src/services/lawyerService.ts
import instance from '@/lib/axios'
import { LawyerLoginRequest, LawyerLoginResponse } from '@/types/authTypes'

export const lawyerService = {
  // 변호사 로그인
  lawyerLogin: async (request: LawyerLoginRequest) => {
    const response = await instance.post<LawyerLoginResponse>('/auth/lawyer/login', request)
    return response.data
  },
}
```

### 2. 타입 정의

#### baroTalkTypes.ts

```typescript
// src/types/baroTalkTypes.ts

// 기본 타입
export type ChatRoomStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'CONSULTING'

export interface ChatMessage {
  chatMessageId: number
  chatMessageContent: string
  chatMessageSenderType: 'USER' | 'LAWYER'
  chatMessageSenderId: number
  chatMessageCreatedAt: string
}

export interface ChatRoom {
  chatRoomId: number
  chatRoomUserId: number
  chatRoomLawyerId: number
  chatRoomStatus: ChatRoomStatus
  chatRoomIsActive: boolean
  chatRoomCreatedAt: string
  chatRoomUpdatedAt: string
  chatRoomLawyer: {
    lawyerId: number
    lawyerName: string
    lawyerProfileImage: string
  }
  chatRoomLastMessage: ChatMessage
  partnerOnlineStatus?: 'online' | 'offline' | 'away'
}

// API 요청 타입
export interface CreateBaroTalkRequest {
  consultationRequestSubcategoryId: number
  consultationRequestTitle: string
  consultationRequestDescription: string
  selectedLawyerIds: number[]
}

export interface BaroTalkLawyerListRequest {
  subcategoryId: number
  page?: number
  take?: number
}

export interface BaroTalkChatListRequest {
  page?: number
  take?: number
}

export interface UpdateChatRoomStatusRequest {
  chatRoomId: number
  status: ChatRoomStatus
}

// API 응답 타입
export interface BaroTalkLawyerListResponse {
  lawyers: Lawyer[]
  hasNextPage: boolean
  totalCount: number
}

export interface BaroTalkChatListResponse {
  chatRooms: ChatRoom[]
  hasNextPage: boolean
  totalCount: number
}

export interface UpdateChatRoomStatusResponse {
  chatRoomId: number
  chatRoomStatus: ChatRoomStatus
  success: boolean
}

// 소켓 이벤트 타입
export interface JoinRoomRequest {
  chatRoomId: number
  loadRecentMessages: boolean
  messageLimit: number
}

export interface JoinRoomSuccessData {
  recentMessages: ChatMessage[]
  chatRoom: ChatRoom
}

export interface UserJoinedData {
  userId: number
  connectedUsers: number
}
```

#### authTypes.ts

```typescript
// src/types/authTypes.ts
export interface LawyerLoginRequest {
  email: string
  password: string
}

export interface LawyerLoginResponse {
  lawyerAccessToken: string
  lawyerRefreshToken: string
  lawyer: {
    lawyerId: number
    lawyerName: string
    email: string
  }
}
```

### 3. React Query 훅

#### useBaroTalk.ts

```typescript
// src/hooks/queries/useBaroTalk.ts
import { useMutation, useInfiniteQuery } from '@tanstack/react-query'
import { baroTalkServices } from '@/services/baroTalkServices'
import { useAuth } from '@/contexts/AuthContext'
import {
  CreateBaroTalkRequest,
  BaroTalkLawyerListRequest,
  BaroTalkChatListRequest,
  UpdateChatRoomStatusRequest,
  UpdateChatRoomStatusResponse,
} from '@/types/baroTalkTypes'
import { QUERY_KEY } from '@/constants/queryKey'

interface UseCreateBaroTalkOptions {
  onSuccess?: (data?: any) => void
  onError?: (error: Error) => void
}

// 바로톡 생성
export const useCreateBaroTalk = (options?: UseCreateBaroTalkOptions) => {
  const { getUserIdFromToken } = useAuth()
  const userId = getUserIdFromToken()

  return useMutation({
    mutationFn: (request: CreateBaroTalkRequest) => baroTalkServices.createBaroTalk(request),
    onSuccess: data => {
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      options?.onError?.(error)
    },
  })
}

// 추천 변호사 목록 조회 (무한 스크롤)
export const useGetBaroTalkLawyerList = (request: BaroTalkLawyerListRequest) => {
  return useInfiniteQuery({
    queryKey: ['baroTalk', 'lawyerList', request],
    queryFn: ({ pageParam = 1 }) =>
      baroTalkServices.getBaroTalkLawyerList({
        ...request,
        page: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNextPage ? allPages.length + 1 : undefined
    },
    initialPageParam: 1,
  })
}

// 채팅방 목록 조회 (무한 스크롤)
export const useGetBaroTalkChatList = (request: BaroTalkChatListRequest) => {
  return useInfiniteQuery({
    queryKey: ['baroTalk', 'chatList', request],
    queryFn: ({ pageParam = 1 }) =>
      baroTalkServices.getBaroTalkChatList({
        ...request,
        page: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNextPage ? allPages.length + 1 : undefined
    },
    initialPageParam: 1,
  })
}

// 채팅방 상태 업데이트
export const useUpdateChatRoomStatus = (options?: UseCreateBaroTalkOptions) => {
  const { getUserIdFromToken } = useAuth()
  const userId = getUserIdFromToken()

  return useMutation<UpdateChatRoomStatusResponse, Error, UpdateChatRoomStatusRequest>({
    mutationFn: ({ chatRoomId, status }: UpdateChatRoomStatusRequest) =>
      baroTalkServices.updateChatRoomStatus(userId!, { chatRoomId, status }),
    onSuccess: data => {
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      options?.onError?.(error)
    },
  })
}
```

## 문제 해결 과정

### 1. ESLint 오류 해결

#### useEffect cleanup 함수 오류

```typescript
// 문제: Arrow function expected no return value
useEffect(() => {
  // ...
  return () => {
    newSocket.disconnect()
  }
}, [dependencies])

// 해결: eslint-disable-next-line 사용
useEffect(() => {
  // ...
  // eslint-disable-next-line
  return () => {
    newSocket.disconnect()
  }
}, [dependencies])
```

### 2. 타입 오류 해결

#### ChatMessage 타입 확장

```typescript
// src/types/baroTalkTypes.ts
export type ChatRoomStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'CONSULTING'

export interface ChatMessage {
  chatMessageId: number
  chatMessageContent: string
  chatMessageSenderType: 'USER' | 'LAWYER'
  chatMessageSenderId: number
  chatMessageCreatedAt: string
}
```

#### JoinRoomSuccessData 타입 정의

```typescript
export interface JoinRoomSuccessData {
  recentMessages: ChatMessage[]
  chatRoom: {
    chatRoomId: number
    chatRoomUserId: number
    chatRoomLawyerId: number
    chatRoomStatus: ChatRoomStatus
    chatRoomIsActive: boolean
    chatRoomCreatedAt: string
    chatRoomUpdatedAt: string
    chatRoomLawyer: {
      lawyerId: number
      lawyerName: string
      lawyerProfileImage: string
    }
  }
}
```

### 3. 성능 최적화

#### 무한 스크롤 구현

```typescript
// src/hooks/queries/useBaroTalk.ts
export const useGetBaroTalkChatList = (request: BaroTalkChatListRequest) => {
  return useInfiniteQuery({
    queryKey: ['baroTalk', 'chatList', request],
    queryFn: ({ pageParam = 1 }) =>
      baroTalkServices.getBaroTalkChatList({
        ...request,
        page: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNextPage ? allPages.length + 1 : undefined
    },
    initialPageParam: 1,
  })
}
```

#### 컴포넌트 최적화

```typescript
// React.memo 사용으로 불필요한 리렌더링 방지
const ChatBubble = React.memo(({ message, direction, color, colorText, profileImage, children }: ChatBubbleProps) => {
  return <div className={`${styles['chat-bubble']} ${styles[direction]}`}>{/* 컴포넌트 내용 */}</div>
})
```

### 4. 상태 관리 최적화

#### React Query 캐싱 전략

```typescript
// placeholderData로 깜빡임 방지
const { data: messages = [] } = useQuery({
  queryKey: ['chat', 'messages', chatRoomId],
  queryFn: () => [],
  staleTime: Infinity,
  placeholderData: previousData => previousData, // 이전 데이터 유지
  enabled: !!chatRoomId,
})
```

#### 의존성 배열 최적화

```typescript
// useCallback으로 함수 안정성 확보
const setConnected = useCallback(
  (connected: boolean) => {
    queryClient.setQueryData(['socket', 'connection'], connected)
  },
  [queryClient]
)
```

## 최종 아키텍처

### 1. 상태 관리 구조

```
React Query Store
├── Socket State
│   ├── useSocketInstance (소켓 인스턴스)
│   ├── useSocketConnection (연결 상태)
│   └── useUserStatuses (사용자 온라인 상태)
├── Chat State
│   ├── useChatRoomId (현재 채팅방 ID)
│   ├── useChatMessages (메시지 목록)
│   ├── useChatStatus (채팅방 상태)
│   └── useChatRoomInfo (채팅방 정보)
└── API State
    ├── useGetBaroTalkLawyerList (변호사 목록)
    ├── useGetBaroTalkChatList (채팅방 목록)
    └── useUpdateChatRoomStatus (상태 업데이트)
```

### 2. 컴포넌트 구조

```
Chat System
├── Chat.tsx (사용자 채팅)
├── LawyerChat.tsx (변호사 채팅)
├── ChatRoomContainer.tsx (채팅방 컨테이너)
│   ├── ChatHeader.tsx (채팅 헤더)
│   └── ChatBody.tsx (채팅 본문)
├── ChatList.tsx (채팅방 목록)
└── ChatWaitingBlogList.tsx (대기 중 블로그 목록)
```

### 3. 데이터 플로우

```
1. 사용자 인증
   ↓
2. 소켓 연결 (useSocketConnection)
   ↓
3. 채팅방 목록 로드 (useGetBaroTalkChatList)
   ↓
4. 채팅방 선택 (useChatRoomId)
   ↓
5. 채팅방 입장 (Socket.IO joinRoom)
   ↓
6. 메시지 송수신 (useChatMessages)
   ↓
7. 상태 업데이트 (useChatStatus)
```

### 4. 성능 최적화 결과

#### 렌더링 최적화

- React Query로 필요한 상태만 구독
- 컴포넌트별 독립적인 상태 관리
- 불필요한 리렌더링 방지

#### 메모리 최적화

- 채팅방별 메시지 캐싱
- 자동 가비지 컬렉션
- 효율적인 상태 업데이트

#### 사용자 경험 개선

- 실시간 메시지 전송
- 온라인 상태 표시
- 시스템 메시지 지원
- 채팅 종료 기능

## 결론

React Query 마이그레이션을 통해 다음과 같은 개선을 달성했습니다:

1. **상태 관리 통합**: 모든 채팅 관련 상태를 React Query로 중앙화
2. **성능 최적화**: 컴포넌트별 독립적인 상태 구독으로 렌더링 최적화
3. **개발자 경험 향상**: React Query DevTools로 상태 추적 및 디버깅 용이
4. **확장성 확보**: 새로운 기능 추가 시 기존 구조 활용 가능
5. **타입 안정성**: TypeScript와 완벽한 통합으로 타입 안정성 확보

이러한 개선을 통해 실시간 채팅 시스템의 안정성과 성능을 크게 향상시켰습니다.
