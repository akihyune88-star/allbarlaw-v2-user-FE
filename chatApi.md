---
## 📋 목차

1. [시스템 개요](about:blank#-%EC%8B%9C%EC%8A%A4%ED%85%9C-%EA%B0%9C%EC%9A%94)
2. [인증 방식](about:blank#-%EC%9D%B8%EC%A6%9D-%EB%B0%A9%EC%8B%9D)
3. [REST API](about:blank#-rest-api)
4. [WebSocket API](about:blank#-websocket-api)
5. [클라이언트 구현 예제](about:blank#-%ED%81%B4%EB%9D%BC%EC%9D%B4%EC%96%B8%ED%8A%B8-%EA%B5%AC%ED%98%84-%EC%98%88%EC%A0%9C)
6. [에러 코드](about:blank#-%EC%97%90%EB%9F%AC-%EC%BD%94%EB%93%9C)
7. [사용 시나리오](about:blank#-%EC%82%AC%EC%9A%A9-%EC%8B%9C%EB%82%98%EB%A6%AC%EC%98%A4)
---

## 🎯 시스템 개요

### 하이브리드 채팅 시스템

- **REST API**: 채팅방 관리, 상담 요청 생성, 상태 업데이트
- **WebSocket**: 실시간 메시지 송수신, 채팅방 입장/퇴장

### 기본 정보

- **베이스 URL**: `http://localhost:3000` (개발환경)
- **WebSocket 네임스페이스**: `/chat`
- **인증 방식**: JWT 토큰

---

## 🔐 인증 방식

### JWT 토큰 사용

```jsx
// REST API - Authorization 헤더
headers: {  'Authorization': 'Bearer YOUR_JWT_TOKEN'}
// WebSocket - auth 객체
const socket = io('http://localhost:3000/chat', {
  auth: {
    token: 'YOUR_JWT_TOKEN'  }
});
```

### 토큰 페이로드 구조

```json
{
  "id": 1,
  "authType": "social",
  "iat": 1753423558,
  "exp": 1753427158
}
```

---

## 🌐 REST API

### 1. 채팅방 목록 조회

**GET** `/chat/:userId/rooms`

UI 오른편 채팅방 목록을 페이지네이션하여 조회합니다.

### 요청

```
GET /chat/1/rooms?chatRoomPage=1&chatRoomOrderBy=lastMessageAt&chatRoomSort=desc
Authorization: Bearer YOUR_JWT_TOKEN
```

### 쿼리 파라미터

| 파라미터          | 타입   | 기본값          | 설명                                                  |
| ----------------- | ------ | --------------- | ----------------------------------------------------- |
| `chatRoomPage`    | number | 1               | 페이지 번호                                           |
| `chatRoomOrderBy` | string | “lastMessageAt” | 정렬 기준 (“createdAt”, “updatedAt”, “lastMessageAt”) |
| `chatRoomSort`    | string | “desc”          | 정렬 방향 (“asc”, “desc”)                             |

### 응답

```json
{
	"chatRooms": [
		{
			"chatRoomId": 1,
			"chatRoomUserId": 1,
			"chatRoomLawyerId": 2,
			"chatRoomConsultationRequestId": 1,
			"chatRoomStatus": "PENDING",
			"chatRoomIsActive": true,
			"chatRoomCreatedAt": "2025-07-28T10:00:00Z",
			"chatRoomUpdatedAt": "2025-07-28T10:30:00Z",
			"chatRoomLastMessageAt": "2025-07-28T10:30:00Z",

			"chatRoomLawyer": {
				"lawyerId": 2,
				"lawyerName": "김변호사",
				"lawyerProfileImage": "https://example.com/profile.jpg"
				"lawfirmName": "법무법인 미래"
			},

			"chatRoomLastMessage": {
				"chatMessageId": 10,
				"chatMessageContent": "안녕하세요. 상담 요청 확인했습니다.",
				"chatMessageSenderType": "LAWYER",
				"chatMessageCreatedAt": "2025-07-28T10:30:00Z"
			}
		}
	],
	"total": 25,
	"page": 1,
	"totalPages": 3
}
```

---

### 2. 상담 요청 생성

**POST** `/chat/:userId/consultation-request`

법률 상담 요청을 생성하고 선택된 변호사들과 개별 채팅방을 생성합니다.

### 요청

```
POST /chat/1/consultation-request
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "consultationRequestTitle": "교통사고 관련 상담",
  "consultationRequestDescription": "신호등이 있는 교차로에서 발생한 교통사고입니다. 과실 비율에 대해 문의드립니다.",
  "consultationRequestSubcategoryId": 5,
  "selectedLawyerIds": [2, 3, 4, 5]
}
```

### 응답

```json
{
  "consultationRequestId": 15,
  "consultationRequestTitle": "교통사고 관련 상담",
  "consultationRequestDescription": "신호등이 있는 교차로에서 발생한 교통사고입니다.",
  "createdChatRooms": [
    {
      "chatRoomId": 20,
      "chatRoomUserId": 1,
      "chatRoomLawyerId": 2,
      "chatRoomStatus": "PENDING",
      "chatRoomLawyer": {
        "lawyerId": 2,
        "lawyerName": "김변호사",
        "lawyerProfileImage": null
      }
    }
  ]
}
```

---

### 3. 채팅방 상태 업데이트

**POST** `/chat/:chatRoomId/status`

채팅방의 상태를 업데이트합니다. (예: PENDING → ACCEPTED/REJECTED)

### 요청

```
POST /chat/1/status
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "status": "ACCEPTED",
  "userId": 2
}
```

### 상태 값

- `PENDING`: 대기 중
- `ACTIVE`: 활성화
- `ACCEPTED`: 수락됨
- `REJECTED`: 거절됨

### 응답

```json
{
  "chatRoomId": 1,
  "chatRoomUserId": 1,
  "chatRoomLawyerId": 2,
  "chatRoomStatus": "ACCEPTED",
  "chatRoomIsActive": true,
  "chatRoomCreatedAt": "2025-07-28T10:00:00Z",
  "chatRoomUpdatedAt": "2025-07-28T11:00:00Z",
  "chatRoomLastMessageAt": "2025-07-28T10:30:00Z",
  "chatRoomLawyer": {
    "lawyerId": 2,
    "lawyerName": "김변호사",
    "lawyerProfileImage": null
  }
}
```

---

### 4. 변호사 채팅 상담 목록

**GET** `/lawyer/:lawyerId/chat-rooms`

변호사가 받은 채팅 상담 목록을 조회합니다.

### 요청

```
GET /lawyer/:lawyerId/chat-rooms
Authorization: Bearer YOUR_JWT_TOKEN
```

### 쿼리 파라미터

| 파라미터   | 타입   | 기본값 | 설명          |
| ---------- | ------ | ------ | ------------- |
| `lawyerId` | number | 1      | 변호사 아이디 |

### 응답

```json
{
    "chatRooms": [
      "chatRoomId": 1
      "chatRoomStatus": "PENDING"
      "chatRoomCreatedAt": "2025-07-30T10:00:00Z"
      "clientId": 2
      "clientName": "이아영"
      "clientMessageCount": 1
      "lawyerMessageCount": 0
      "lawyerFirstResponseAt": null
      "consultationRequestTitle": "교통사고 관련 상담"
    ],
    "total": 1,
    "page": 1,
    "totalPages": 1
}
```

---

## 💬 WebSocket API

### 연결 설정

```jsx
const socket = io('http://localhost:3000/chat', {
  auth: {
    token: 'YOUR_JWT_TOKEN',
  },
})

// 연결 이벤트
socket.on('connect', () => {
  console.log('✅ WebSocket 연결 성공')
})

socket.on('disconnect', () => {
  console.log('❌ WebSocket 연결 해제')
})
```

---

### 1. 채팅방 입장 (joinRoom)

### 이벤트 송신

```jsx
socket.emit('joinRoom', {
  chatRoomId: 1,
  loadRecentMessages: true, // 최근 메시지 로딩 여부
  messageLimit: 50, // 로딩할 메시지 수 (기본: 50개)
})
```

### 응답 이벤트

```jsx
// 성공
socket.on('joinRoomSuccess', data => {
  console.log('채팅방 입장 성공:', data)
  /*
	  {
		  "chatRoomId": 1,
		  "connectedUsers": 2,
		  "lastReadMessageId": 15,
		  "chatRoom": {
			  "chatRoomId": 1,
			  "chatRoomUserId": 1,
			  "chatRoomLawyerId": 2,
			  "chatRoomStatus": "ACTIVE",
			  "chatRoomLawyer": {
				  "lawyerId": 2,
				  "lawyerName": "김변호사"
				}
		},
		"recentMessages": [
			{
				"chatMessageId": 16,
				"chatMessageContent": "안녕하세요",
				"chatMessageSenderType": "USER",
				"chatMessageSenderId": 1,
				"chatMessageCreatedAt": "2025-07-28T10:00:00Z"
			}
		]
	}
*/
})

// 실패
socket.on('joinRoomError', error => {
  console.error('채팅방 입장 실패:', error.message)
})

// 다른 사용자 입장 알림
socket.on('userJoined', data => {
  console.log(`사용자 ${data.userId} 입장 (총 ${data.connectedUsers}명)`)
})
```

---

### 2. 메시지 전송 (sendMessage)

### 이벤트 송신

```jsx
socket.emit('sendMessage', {
  chatRoomId: 1,
  content: '안녕하세요. 상담 문의드립니다.',
  receiverId: 2, // 수신자 ID
  receiverType: 'LAWYER', // 수신자 타입 ("USER" | "LAWYER")
  tempId: 'temp_123', // 클라이언트 임시 ID (선택사항)
})
```

### 응답 이벤트

```jsx
// 전송 성공
socket.on('sendMessageSuccess', data => {
  console.log('메시지 전송 성공:', data)
  /*
	  {
		  "tempId": "temp_123",
		  "messageId": 17,
		  "timestamp": "2025-07-28T10:05:00Z"
		}
	*/
})

// 새 메시지 수신 (모든 참여자에게 브로드캐스트)
socket.on('newMessage', message => {
  console.log('새 메시지:', message)
  /*
	  {
		  "chatMessageId": 17,
		  "chatMessageContent": "안녕하세요. 상담 문의드립니다.",
		  "chatMessageSenderType": "USER",
		  "chatMessageSenderId": 1,
		  "chatMessageReceiverId": 2,
		  "chatMessageReceiverType": "LAWYER",
		  "chatMessageIsRead": false,
		  "chatMessageCreatedAt": "2025-07-28T10:05:00Z",
		  "chatMessageSender": {
			  "senderProfileImage": null
			}
		}
	*/
})

// 전송 실패
socket.on('sendMessageError', error => {
  console.error('메시지 전송 실패:', error.message)
})
```

---

### 3. 추가 메시지 로딩 (loadMoreMessages)

### 이벤트 송신

```jsx
socket.emit('loadMoreMessages', {
  chatRoomId: 1,
  lastMessageId: 10, // 마지막으로 받은 메시지 ID
  limit: 20, // 로딩할 메시지 수 (기본: 20개)
})
```

### 응답 이벤트

```jsx
socket.on('messagesLoaded', data => {
  console.log('메시지 로딩 완료:', data)
  /*
	  {
		  "chatRoomId": 1,
		  "messages": [...],           // 메시지 배열
		  "hasMore": true,            // 더 로딩할 메시지가 있는지
		  "oldestMessageId": 5        // 가장 오래된 메시지 ID
		}
	*/
})

socket.on('loadMoreMessagesError', error => {
  console.error('메시지 로딩 실패:', error.message)
})
```

---

### 4. 메시지 읽음 처리 (markAsRead)

### 이벤트 송신

```jsx
// 특정 메시지들 읽음 처리
socket.emit('markAsRead', {
  chatRoomId: 1,
  messageIds: [15, 16, 17], // 읽음 처리할 메시지 ID 배열 (선택사항)
})

// 채팅방의 모든 안 읽은 메시지 읽음 처리
socket.emit('markAsRead', {
  chatRoomId: 1, // messageIds 생략시 모든 안 읽은 메시지 처리
})
```

### 응답 이벤트

```jsx
socket.on('markAsReadSuccess', data => {
  console.log('읽음 처리 완료:', data)
  /*
	  {
		  "chatRoomId": 1,
		  "processedMessageIds": [15, 16, 17],
		  "timestamp": "2025-07-28T10:10:00Z"
		}
	*/
})

// 다른 참여자에게 읽음 상태 알림
socket.on('messagesMarkedAsRead', data => {
  console.log('메시지 읽음 상태 업데이트:', data)
  /*
	  {
		  "userId": 2,
		  "chatRoomId": 1,
		  "messageIds": [15, 16, 17],
		  "timestamp": "2025-07-28T10:10:00Z"
		}
	*/
})
```

---

### 5. 채팅방 퇴장 (leaveRoom)

### 이벤트 송신

```jsx
socket.emit('leaveRoom', {
  chatRoomId: 1,
})
```

### 응답 이벤트

```jsx
socket.on('leaveRoomSuccess', data => {
  console.log('채팅방 퇴장 성공:', data)
  /*
	  {
		  "chatRoomId": 1,
		  "connectedUsers": 1
		}
	*/
})

// 다른 사용자 퇴장 알림
socket.on('userLeft', data => {
  console.log(`사용자 ${data.userId} 퇴장 (총 ${data.connectedUsers}명)`)
})
```

---

## 💻 클라이언트 구현 예제

### React + Socket.io 구현 예제

```jsx
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
const ChatComponent = ({ userId, jwtToken }) => {
  const [socket, setSocket] = useState(null)
  const [currentRoom, setCurrentRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('') // WebSocket 연결

  useEffect(() => {
    const newSocket = io('http://localhost:3000/chat', {
      auth: { token: jwtToken },
    })

    newSocket.on('connect', () => {
      console.log('✅ WebSocket 연결 성공')
    })

    newSocket.on('newMessage', message => {
      setMessages(prev => [...prev, message])
    })

    newSocket.on('joinRoomSuccess', data => {
      setCurrentRoom(data.chatRoomId)
      setMessages(data.recentMessages || [])
    })

    setSocket(newSocket)

    return () => newSocket.close()
  }, [jwtToken])

  // 채팅방 입장
  const joinRoom = roomId => {
    if (socket) {
      socket.emit('joinRoom', {
        chatRoomId: roomId,
        loadRecentMessages: true,
        messageLimit: 50,
      })
    }
  }

  // 메시지 전송
  const sendMessage = () => {
    if (socket && currentRoom && messageInput.trim()) {
      socket.emit('sendMessage', {
        chatRoomId: currentRoom,
        content: messageInput,
        receiverId: 2, // 변호사 ID
        receiverType: 'LAWYER',
      })

      setMessageInput('')
    }
  }

  return (
    <div>
      <div className='messages'>
        {messages.map(msg => (
          <div key={msg.chatMessageId}>
            <strong>{msg.chatMessageSenderType === 'USER' ? '👤' : '⚖️'}</strong>
            {msg.chatMessageContent}
          </div>
        ))}
      </div>
      <div className='input-area'>
        <input
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder='메시지를 입력하세요...'
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  )
}
```

### REST API 호출 예제

```jsx
// 채팅방 목록 조회
const fetchChatRooms = async userId => {
  try {
    const response = await fetch(`/chat/${userId}/rooms?chatRoomPage=1`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })

    const data = await response.json()
    return data.chatRooms
  } catch (error) {
    console.error('채팅방 목록 조회 실패:', error)
  }
}

// 상담 요청 생성
const createConsultationRequest = async (userId, requestData) => {
  try {
    const response = await fetch(`/chat/${userId}/consultation-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(requestData),
    })

    return await response.json()
  } catch (error) {
    console.error('상담 요청 생성 실패:', error)
  }
}
```

---

## ⚠️ 에러 코드

| 코드   | 설명                            | HTTP 상태 |
| ------ | ------------------------------- | --------- |
| `4024` | 채팅방을 찾을 수 없습니다       | 404       |
| `4025` | 채팅방에 참여할 권한이 없습니다 | 403       |
| `4026` | 비활성화된 채팅방입니다         | 403       |
| `4027` | 메시지를 찾을 수 없습니다       | 404       |
| `4001` | 검증 오류                       | 400       |

### 에러 응답 형식

```json
{
  "statusCode": 404,
  "message": "채팅방을 찾을 수 없습니다",
  "error": "Not Found"
}
```

---

## 📱 사용 시나리오

### 1. 기본 채팅 플로우

```jsx
// 1단계: 채팅방 목록 조회 (REST API)
const chatRooms = await fetchChatRooms(userId)

// 2단계: WebSocket 연결
const socket = io('http://localhost:3000/chat', {
  auth: { token: jwtToken },
})

// 3단계: 특정 채팅방 입장
socket.emit('joinRoom', {
  chatRoomId: 1,
  loadRecentMessages: true,
})

// 4단계: 메시지 전송
socket.emit('sendMessage', {
  chatRoomId: 1,
  content: '안녕하세요',
  receiverId: 2,
  receiverType: 'LAWYER',
})

// 5단계: 개별 나가기 (필요시)
socket.emit('leaveRoom', {
  chatRoomId: 1,
})
```

### 3. 개별 나가기 플로우 🆕

```jsx
// REST API 방식 - 서버에서 나가기 처리
const leaveChat = async (roomId, userId) => {
  try {
    const response = await fetch(`/chat/${roomId}/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        userId: userId,
        userType: 'USER',
        reason: '상담 완료',
      }),
    })

    const result = await response.json()
    if (result.chatRoomIsActive) {
      console.log('일방향 채팅 상태 - 상대방은 계속 채팅 가능')
    } else {
      console.log('채팅방 완전 종료')
    }
  } catch (error) {
    console.error('나가기 실패:', error)
  }
}

// WebSocket 방식 - 실시간 나가기 처리
socket.emit('leaveRoom', { chatRoomId: 1 })
socket.on('leaveRoomSuccess', data => {
  if (data.chatRoomIsActive) {
    showToast('채팅방을 나갔습니다. 상대방은 계속 채팅할 수 있습니다.')
  } else {
    showToast('채팅방이 완전히 종료되었습니다.')
  }
})
```

### 2. 상담 요청 생성 플로우

```jsx
// 1단계: 상담 요청 생성 (REST API)
const consultationRequest = await createConsultationRequest(userId, {
  consultationRequestTitle: '교통사고 상담',
  consultationRequestDescription: '상담 내용...',
  consultationRequestSubcategoryId: 5,
  selectedLawyerIds: [2, 3, 4],
})

// 2단계: 생성된 채팅방에 입장 (WebSocket)
const firstChatRoom = consultationRequest.createdChatRooms[0]
socket.emit('joinRoom', {
  chatRoomId: firstChatRoom.chatRoomId,
})
```

---

## 🆕 개별 나가기 구현 가이드

### 1. 상태 관리

```jsx
const [chatRoomState, setChatRoomState] = useState({
  isActive: true,
  userLeft: false,
  lawyerLeft: false,
  currentUserCanChat: true,
})
이거 
// WebSocket 이벤트로 상태 업데이트
socket.on('userLeft', data => {
  setChatRoomState({
    isActive: data.chatRoomIsActive,
    userLeft: data.userLeft,
    lawyerLeft: data.lawyerLeft,
    currentUserCanChat: !data.chatRoomIsActive ? false : currentUserType === 'USER' ? !data.userLeft : !data.lawyerLeft,
  })
})
```

### 2. UI 상태 표시

```jsx
const ChatStatusIndicator = ({ chatRoomState, currentUserType }) => {
  const { isActive, userLeft, lawyerLeft } = chatRoomState

  if (!isActive) {
    return <div className='chat-ended'>💬 채팅이 종료되었습니다</div>
  }

  if (userLeft && !lawyerLeft) {
    return (
      <div className='one-way-chat'>
        👤 사용자가 나갔습니다 {currentUserType === 'LAWYER' && '(변호사만 채팅 가능)'}
      </div>
    )
  }

  if (lawyerLeft && !userLeft) {
    return (
      <div className='one-way-chat'>⚖️ 변호사가 나갔습니다 {currentUserType === 'USER' && '(사용자만 채팅 가능)'}</div>
    )
  }

  return <div className='chat-active'>💬 채팅 중</div>
}
```

### 3. 나가기 버튼 구현

```jsx
const LeaveChatButton = ({ roomId, userId, userType, onLeave }) => {
  const [isLeaving, setIsLeaving] = useState(false)
  const handleLeave = async () => {
    if (!confirm('정말 채팅방을 나가시겠습니까?')) return

    setIsLeaving(true)

    try {
      // REST API로 나가기 처리
      const response = await fetch(`/chat/${roomId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getJwtToken()}`,
        },
        body: JSON.stringify({
          userId,
          userType,
          reason: '사용자 요청',
        }),
      })

      const result = await response.json()

      // WebSocket으로도 나가기 (실시간 알림용)
      socket.emit('leaveRoom', { chatRoomId: roomId })
      onLeave(result)
    } catch (error) {
      alert('나가기 처리 중 오류가 발생했습니다.')
    } finally {
      setIsLeaving(false)
    }
  }

  return (
    <button onClick={handleLeave} disabled={isLeaving} className='leave-chat-btn'>
      {isLeaving ? '나가는 중...' : '채팅방 나가기'}
    </button>
  )
}
```

### 4. 에러 처리

```jsx
const handleChatError = error => {
  switch (error.statusCode) {
    case 4028: // CHAT_ROOM_ALREADY_LEFT
      showToast('이미 나간 채팅방입니다.')
      redirectToChatList()
      break
    case 4029: // CHAT_ROOM_REJECTED
      showToast('거절된 상담 요청입니다.')
      redirectToChatList()
      break
    case 4026: // CHAT_ROOM_INACTIVE
      showToast('비활성화된 채팅방입니다.')
      redirectToChatList()
      break
    default:
      showToast('채팅 처리 중 오류가 발생했습니다.')
  }
}
```

---

## 🔧 개발 팁

### 1. 메시지 상태 관리

- 임시 ID(`tempId`)를 사용하여 전송 중인 메시지 표시
- `sendMessageSuccess` 이벤트로 전송 완료 확인

### 2. 실시간 연결 관리

- 네트워크 끊김 시 자동 재연결 처리
- `connect`/`disconnect` 이벤트로 연결 상태 표시

### 3. 성능 최적화

- 메시지 가상화(Virtual Scrolling)로 대량 메시지 처리
- `loadMoreMessages`로 점진적 메시지 로딩

### 4. 보안 고려사항

- JWT 토큰 만료 시 자동 갱신
- 민감한 정보는 메시지에 포함하지 않기

### 5. 개별 나가기 주의사항 🆕

- **중복 나가기 방지**: 이미 나간 사용자의 재나가기 차단
- **상태 동기화**: REST API와 WebSocket 이벤트 모두 처리
- **UI 일관성**: 일방향 채팅 상태를 명확히 표시
- **에러 처리**: 4028, 4029 에러 코드 적절히 처리

---

## 📋 변경사항 요약 🆕

### 새로 추가된 기능

1. **개별 나가기 REST API** - `POST /chat/:roomId/leave`
2. **WebSocket 개별 나가기 이벤트** - 업데이트된 `leaveRoom` 이벤트
3. **새로운 에러 코드** - 4028 (이미 나감), 4029 (거절됨)
4. **일방향 채팅 지원** - 한 명이 나가도 상대방은 계속 채팅 가능

### 변경된 응답 형식

**기존 WebSocket leaveRoom 응답:**

```json
{
  "chatRoomId": 1,
  "connectedUsers": 1
}
```

**새로운 WebSocket leaveRoom 응답:**

```json
{
  "chatRoomId": 1,
  "connectedUsers": 1,
  "userLeft": true,
  "lawyerLeft": false,
  "chatRoomIsActive": true
}
```

### 마이그레이션 가이드

**기존 코드에서 새 코드로 마이그레이션:**

```jsx
// 기존 코드
socket.on('userLeft', data => {
  console.log(`사용자 ${data.userId} 퇴장`) // 채팅방이 완전히 종료된 것으로 처리
})

// 새 코드 🆕
socket.on('userLeft', data => {
  console.log(`사용자 개별 나가기:`, data)

  if (!data.chatRoomIsActive) {
    // 양쪽 모두 나간 경우
    showMessage('채팅방이 종료되었습니다.')
    disableChatInput()
  } else {
    // 한쪽만 나간 경우 - 일방향 채팅
    const isCurrentUserLeft =
      (currentUserType === 'USER' && data.userLeft) || (currentUserType === 'LAWYER' && data.lawyerLeft)
    if (isCurrentUserLeft) {
      showMessage('채팅방을 나갔습니다.')
      disableChatInput()
    } else {
      showMessage(`${data.leftUserType === 'USER' ? '사용자' : '변호사'}가 나갔습니다. 일방향 채팅 상태입니다.`)
      // 채팅 입력은 여전히 가능
    }
  }
})
```

---
