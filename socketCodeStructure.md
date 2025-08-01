# 🔌 Socket 코드 구조 참조 문서

## 📋 목차

1. [시스템 아키텍처](#-시스템-아키텍처)
2. [핵심 파일 구조](#-핵심-파일-구조)
3. [상태 관리](#-상태-관리)
4. [WebSocket 훅](#-websocket-훅)
5. [컴포넌트 구조](#-컴포넌트-구조)
6. [라우팅 구조](#-라우팅-구조)
7. [API 서비스](#-api-서비스)
8. [타입 정의](#-타입-정의)
9. [사용 패턴](#-사용-패턴)

---

## 🏗️ 시스템 아키텍처

### 전체 구조
```
Client (React) ↔ WebSocket ↔ Server
      ↓
   Zustand Store (상태 관리)
      ↓
   React Query (REST API)
```

### 하이브리드 통신
- **WebSocket**: 실시간 메시지, 입장/퇴장, 상태 변경
- **REST API**: 채팅방 관리, 나가기, 상태 업데이트

---

## 📁 핵심 파일 구조

### WebSocket 관련 파일
```
src/
├── hooks/
│   └── useChatSocket.ts          # 메인 WebSocket 훅
├── stores/
│   └── socketStore.ts            # Zustand 소켓 상태 관리
├── services/
│   └── baroTalkServices.ts       # REST API 서비스
└── types/
    └── baroTalkTypes.ts          # 타입 정의
```

### 컴포넌트 구조
```
src/
├── pages/
│   ├── baroTalk/
│   │   └── chat/
│   │       └── Chat.tsx          # 유저용 채팅 페이지
│   └── lawyerAdmin/
│       └── chat/
│           ├── lawyerChat/
│           │   └── LawyerChat.tsx    # 변호사용 채팅 페이지
│           └── lawyerChatList/
│               └── LawyerChatList.tsx # 변호사 채팅 목록
└── container/
    └── baroTalk/
        ├── chatRoomContainer/
        │   └── ChatRoomContainer.tsx # 채팅방 컨테이너
        ├── chatHeader/
        │   └── ChatHeader.tsx        # 채팅 헤더
        ├── chatBody/
        │   └── ChatBody.tsx          # 채팅 본문
        ├── chatList/
        │   └── ChatList.tsx          # 채팅방 목록
        └── chatWaitingBlogList/
            └── ChatWaitingBlogList.tsx # 대기 중 블로그 목록
```

---

## 🗃️ 상태 관리

### Zustand Store (`socketStore.ts`)

#### 주요 상태
```typescript
interface SocketState {
  // 소켓 연결
  socket: Socket | null
  isConnected: boolean
  
  // 재연결 관리
  isReconnecting: boolean
  reconnectAttempts: number
  lastDisconnectTime: number | null
  
  // 채팅방 상태
  chatRoomId: number | null
  messages: ChatMessage[]
  chatStatus: ChatRoomStatus
  roomInfo: any
  
  // 사용자 온라인 상태
  userStatuses: Record<number, string>
  
  // 메시지 캐시
  messageCache: Record<number, ChatMessage[]>
}
```

#### 주요 액션
```typescript
// 소켓 관리
setSocket(socket: Socket | null)
setConnected(isConnected: boolean)

// 메시지 관리
setMessages(messages: ChatMessage[])
addMessage(message: ChatMessage)
updateMessage(messageId: number, updates: Partial<ChatMessage>)
updateMessageByTempId(tempId: string, updates: Partial<ChatMessage>)

// 채팅방 관리
setChatRoomId(chatRoomId: number | null)
setChatStatus(status: ChatRoomStatus)
setRoomInfo(roomInfo: any)

// 사용자 상태 관리
updateUserStatus(userId: number, status: string)
updateBatchUserStatus(statuses: Record<number, string>)
```

#### 셀렉터 사용법
```typescript
// 상태 구독
const socket = useSocket()
const isConnected = useIsConnected()
const messages = useMessages()
const chatRoomId = useChatRoomId()

// 액션 사용
const setSocket = useSetSocket()
const addMessage = useAddMessage()
const setChatRoomId = useSetChatRoomId()
```

---

## 🔌 WebSocket 훅

### `useChatSocket.ts` 구조

#### Props
```typescript
interface UseChatSocketProps {
  chatRoomId: number | null
  setChatStatus: (status: any) => void
}
```

#### 반환값
```typescript
{
  socket: Socket | null
  isConnected: boolean
  sendMessage: (content: string, roomInfo: any) => void
  leaveRoom: () => void
  markAsRead: (messageIds?: number[]) => void
  isLawyer: boolean
}
```

#### 주요 이벤트 리스너
```typescript
// 채팅방 입장
socket.on('joinRoomSuccess', handleJoinRoomSuccess)
socket.on('joinRoomError', handleJoinRoomError)

// 메시지 관련
socket.on('newMessage', handleNewMessage)
socket.on('sendMessageSuccess', handleSendMessageSuccess)
socket.on('sendMessageError', handleSendMessageError)

// 읽음 처리
socket.on('markAsReadSuccess', handleMarkAsReadSuccess)
socket.on('messagesMarkedAsRead', handleMessagesMarkedAsRead)

// 나가기 관련
socket.on('userLeft', handleUserLeft)
socket.on('leaveRoomSuccess', handleLeaveRoomSuccess)
socket.on('leaveRoomError', handleLeaveRoomError)

// 다양한 나가기 이벤트 이름 지원
socket.on('user_left', handleUserLeft)
socket.on('userDisconnected', handleUserLeft)
socket.on('memberLeft', handleUserLeft)
socket.on('chatRoomLeft', handleUserLeft)
socket.on('roomLeft', handleUserLeft)
```

#### 소켓 연결 로직
```typescript
useEffect(() => {
  if (!userId || !chatRoomId) return

  const newSocket = io(VITE_SERVER_API + '/chat', {
    auth: {
      token: getAccessToken()
    },
    reconnection: false
  })

  // 연결 후 자동 방 입장
  newSocket.on('connect', () => {
    setConnected(true)
    if (chatRoomId) {
      newSocket.emit('joinRoom', {
        chatRoomId,
        loadRecentMessages: true,
        messageLimit: 50
      })
    }
  })

  return () => {
    newSocket.disconnect()
    // cleanup
  }
}, [userId, chatRoomId])
```

---

## 🧩 컴포넌트 구조

### 1. ChatRoomContainer.tsx
**역할**: 채팅방의 메인 컨테이너
```typescript
interface ChatRoomContainerProps {
  chatRoomId: number | null
  userLeft?: boolean
  clientName?: string  // 변호사가 볼 때 클라이언트 이름
  clientId?: number    // 변호사가 볼 때 클라이언트 ID
}

// 주요 기능
- useChatSocket으로 WebSocket 연결
- useLeaveChatRoom으로 나가기 처리
- ChatHeader, ChatBody 조합
- 변호사/유저 구분하여 다른 UI 표시
```

### 2. ChatHeader.tsx
**역할**: 채팅방 상단 헤더
```typescript
interface ChatHeaderProps {
  isActive: boolean
  count: { total: number; month: number }
  onEndChat?: () => void
  isLawyer: boolean
  
  // 변호사 정보 (유저가 볼 때)
  lawfirmName?: string
  lawyerName?: string
  lawyerProfileImage?: string
  
  // 유저 정보 (변호사가 볼 때)
  userId?: number
  userName?: string
}

// 조건부 렌더링
- 유저: 변호사 정보 + 채팅 상담 건수 표시
- 변호사: 클라이언트 정보만 표시 (건수 숨김)
```

### 3. ChatBody.tsx
**역할**: 메시지 목록 및 입력창
```typescript
interface ChatBodyProps {
  chatRoomId: number | null
  chatStatus: ChatRoomStatus
  messages: ChatMessage[]
  onSendMessage: (content: string) => void
  isConnected: boolean
  type: 'USER' | 'LAWYER'
  userLeft: boolean
}
```

### 4. ChatList.tsx
**역할**: 채팅방 목록 (유저용)
```typescript
// 주요 기능
- useGetBaroTalkChatList로 채팅방 목록 조회
- 변호사 온라인 상태 실시간 표시
- 채팅방 클릭 시 chatRoomId 설정
```

### 5. LawyerChatList.tsx
**역할**: 채팅방 목록 (변호사용)
```typescript
// 주요 기능
- useGetLawyerChatList로 변호사 채팅 목록 조회
- 무한 스크롤 지원
- 클립 기능 (로컬스토리지 기반)
- 클라이언트 이름과 ID를 LawyerChat에 전달
```

### 6. ChatWaitingBlogList.tsx
**역할**: 채팅 대기 중 표시되는 블로그 목록
```typescript
// 주요 기능 
- 채팅 시작하기 버튼
- 대화방 나가기 버튼 (REST API + WebSocket)
- 관련 블로그 목록 표시
```

---

## 🗺️ 라우팅 구조

### 라우터 상수 (`routerConstant.ts`)
```typescript
export const ROUTER = {
  // 일반 사용자
  BARO_TALK: '/baro-talk',
  CHAT: '/chat',
  CHAT_LIST: 'chat-list',
  
  // 변호사 관리
  LAWYER_ADMIN_CHAT_LIST: '/lawyer-admin/chat-list',
  LAWYER_ADMIN_CHAT: '/lawyer-admin/chat',
}
```

### 페이지별 라우팅 로직

#### 유저 채팅 페이지 (`Chat.tsx`)
```typescript
// /chat 경로
- ChatRoomContainer + ChatList 조합
- chatRoomId 상태에 따라 조건부 렌더링
- 채팅방 미선택시 안내 메시지 표시
```

#### 변호사 채팅 페이지 (`LawyerChat.tsx`)
```typescript
// /lawyer-admin/chat 경로
- useLocation으로 state에서 clientName, clientId 수신
- ChatRoomContainer에 클라이언트 정보 전달
```

### 네비게이션 패턴
```typescript
// 채팅방 나가기 후 이동
if (isLawyer) {
  navigate('/lawyer-admin/chat-list', { replace: true })
} else {
  navigate('/chat')
}

// 변호사 채팅방 클릭
navigate(ROUTER.LAWYER_ADMIN_CHAT, {
  state: {
    userLeft: chatRoom.userLeft,
    clientName: chatRoom.clientName,
    clientId: chatRoom.clientId,
  }
})
```

---

## 🌐 API 서비스

### REST API (`baroTalkServices.ts`)
```typescript
export const baroTalkServices = {
  // 채팅방 목록 조회 (유저)
  getBaroTalkChatList: async (userId: number, request: BaroTalkChatListRequest)
  
  // 변호사 채팅방 목록 조회
  getLawyerChatList: async (lawyerId: number, request?: {...})
  
  // 채팅방 나가기
  leaveChatRoom: async (request: LeaveChatRoomRequest)
  
  // 채팅방 상태 업데이트
  updateChatRoomStatus: async (userId: number, request: UpdateChatRoomStatusRequest)
}
```

### React Query 훅 (`useBaroTalk.ts`)
```typescript
// 채팅방 목록 조회
export const useGetBaroTalkChatList = (request: BaroTalkChatListRequest)

// 변호사 채팅방 목록 (무한 스크롤)
export const useGetLawyerChatList = (lawyerId: number, request?: {...})

// 채팅방 나가기
export const useLeaveChatRoom = (options?: UseCreateBaroTalkOptions)

// 채팅방 상태 업데이트
export const useUpdateChatRoomStatus = (options?: UseCreateBaroTalkOptions)
```

---

## 🏷️ 타입 정의

### 핵심 타입 (`baroTalkTypes.ts`)

#### 채팅방 상태
```typescript
export type ChatRoomStatus =
  | 'PENDING'      // 대기 중
  | 'ACTIVE'       // 활성화
  | 'COMPLETED'    // 완료
  | 'CANCELLED'    // 취소
  | 'CONSULTING'   // 상담 중
  | 'PARTIAL_LEFT' // 일방향 채팅
  | 'REJECTED'     // 거절
```

#### 메시지 타입
```typescript
export type ChatMessage = {
  chatMessageId: number
  chatMessageContent: string
  chatMessageSenderType: 'USER' | 'LAWYER'
  chatMessageSenderId: number
  chatMessageReceiverId?: number
  chatMessageReceiverType?: 'USER' | 'LAWYER'
  chatMessageIsRead?: boolean
  chatMessageCreatedAt: string
  
  // 로컬 상태 (전송 상태 추적용)
  tempId?: string
  status?: 'sending' | 'sent' | 'failed'
}
```

#### 채팅방 나가기
```typescript
export type LeaveChatRoomRequest = {
  userId: number
  userType: 'USER' | 'LAWYER'
  reason: string
  roomId: number
}

export type UserLeftData = {
  chatRoomId: number
  connectedUsers: number
  userLeft: boolean
  lawyerLeft: boolean
  chatRoomIsActive: boolean
  leftUserType?: 'USER' | 'LAWYER'
  leftUserName?: string
}
```

---

## 🔄 사용 패턴

### 1. 채팅방 입장 패턴
```typescript
// 1. 채팅방 ID 설정
setChatRoomId(chatRoomId)

// 2. useChatSocket이 자동으로 WebSocket 연결 및 joinRoom 실행
const { isConnected, sendMessage, leaveRoom } = useChatSocket({
  chatRoomId,
  setChatStatus
})

// 3. 소켓이 자동으로 joinRoom 이벤트 발송
// 4. joinRoomSuccess 이벤트로 메시지 로드 및 상태 설정
```

### 2. 메시지 전송 패턴
```typescript
// 1. UI에 임시 메시지 표시
const tempMessage: ChatMessage = {
  chatMessageId: Date.now(),
  chatMessageContent: content,
  tempId: `temp_${Date.now()}`,
  status: 'sending'
}
addMessage(tempMessage)

// 2. WebSocket으로 전송
socket.emit('sendMessage', {
  chatRoomId,
  content,
  tempId
})

// 3. sendMessageSuccess로 실제 ID 업데이트
socket.on('sendMessageSuccess', (data) => {
  updateMessageByTempId(data.tempId, {
    chatMessageId: data.messageId,
    status: 'sent'
  })
})
```

### 3. 채팅방 나가기 패턴
```typescript
// 1. REST API 호출
const leaveRequest = {
  roomId: chatRoomId,
  userType: isLawyer ? 'LAWYER' : 'USER',
  reason: '사용자 요청',
  userId: userKeyId
}
leaveChatRoom(leaveRequest)

// 2. 성공 시 WebSocket 나가기도 호출
const { mutate: leaveChatRoom } = useLeaveChatRoom({
  onSuccess: (data) => {
    leaveRoom()           // WebSocket 나가기
    setChatRoomId(null)   // 상태 초기화
    
    // 적절한 페이지로 리다이렉트
    if (isLawyer) {
      navigate('/lawyer-admin/chat-list')
    }
  }
})
```

### 4. 사용자 상태 관리 패턴
```typescript
// 변호사 온라인 상태 실시간 업데이트
const userStatuses = useUserStatuses()
const updateUserStatus = useUpdateUserStatus()

// WebSocket 이벤트로 상태 업데이트
socket.on('userStatusUpdate', (data) => {
  updateUserStatus(data.userId, data.status)
})

// UI에서 사용
const lawyerStatus = userStatuses[lawyerId] || 'offline'
```

### 5. 에러 처리 패턴
```typescript
// WebSocket 에러
socket.on('sendMessageError', (error) => {
  if (error.tempId) {
    updateMessageByTempId(error.tempId, {
      status: 'failed'
    })
  }
})

// REST API 에러
const { mutate: leaveChatRoom } = useLeaveChatRoom({
  onError: (error) => {
    console.error('채팅방 나가기 실패:', error)
    alert('채팅방 나가기에 실패했습니다.')
  }
})
```

---

## 🔧 개발 팁

### 1. 디버깅
```typescript
// 소켓 이벤트 모니터링
useEffect(() => {
  if (!socket) return
  
  const originalEmit = socket.emit
  socket.emit = function(...args) {
    console.log('📤 Socket Emit:', args)
    return originalEmit.apply(this, args)
  }
  
  const originalOn = socket.on
  socket.on = function(event, callback) {
    const wrappedCallback = (...args) => {
      console.log('📥 Socket Event:', event, args)
      return callback(...args)
    }
    return originalOn.call(this, event, wrappedCallback)
  }
}, [socket])
```

### 2. 상태 동기화
```typescript
// REST API와 WebSocket 상태 동기화
const { mutate: updateStatus } = useUpdateChatRoomStatus({
  onSuccess: (data) => {
    // Zustand 상태도 함께 업데이트
    setChatStatus(data.chatRoomStatus)
  }
})
```

### 3. 메모리 누수 방지
```typescript
useEffect(() => {
  // 타이머 참조 관리
  const timeoutRefs = new Set<NodeJS.Timeout>()
  
  const timeoutId = setTimeout(() => {
    // 작업 수행
    timeoutRefs.delete(timeoutId)
  }, 1000)
  
  timeoutRefs.add(timeoutId)
  
  return () => {
    // 정리
    timeoutRefs.forEach(clearTimeout)
    timeoutRefs.clear()
  }
}, [])
```

---

이 문서는 ALLBARLAW 프로젝트의 WebSocket 채팅 시스템 구조를 이해하고 개발할 때 참조하기 위한 종합 가이드입니다.