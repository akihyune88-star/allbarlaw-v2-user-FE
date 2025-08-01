# 🚪 채팅 나가기 기능 구현 문서

## 📋 개요

실시간 채팅에서 사용자가 개별적으로 나갈 수 있는 기능을 구현했습니다. 
한쪽이 나가도 상대방은 계속 메시지를 보낼 수 있는 **일방향 채팅 시스템**을 지원합니다.

## 🔄 작동 원리

### 1. 나가기 처리 플로우

```
[유저] 나가기 버튼 클릭 
    ↓
[REST API] POST /chat/:roomId/leave 
    ↓
[WebSocket] leaveRoom 이벤트 전송
    ↓
[서버] userLeft 이벤트를 다른 참여자에게 브로드캐스트
    ↓
[변호사] userLeft 이벤트 수신 → UI 업데이트
```

### 2. 채팅방 상태 분류

| 상태 | 설명 | UI 표시 |
|------|------|---------|
| `ACTIVE` | 양쪽 모두 참여 중 | 정상 채팅 가능 |
| `PARTIAL_LEFT` | 한쪽만 나간 상태 | 노란색 안내 + 채팅 가능 |
| `COMPLETED` | 양쪽 모두 나가거나 완전 종료 | 회색 종료 메시지 |

## 🛠️ 구현 상세

### 1. 타입 정의 (`baroTalkTypes.ts`)

```typescript
// 채팅방 상태에 PARTIAL_LEFT 추가
export type ChatRoomStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'CONSULTING' | 'PARTIAL_LEFT'

// userLeft 이벤트 데이터
export type UserLeftData = {
  chatRoomId: number
  connectedUsers: number
  userLeft: boolean
  lawyerLeft: boolean
  chatRoomIsActive: boolean
  leftUserType?: 'USER' | 'LAWYER'
  leftUserName?: string
}

// joinRoomSuccess에 나가기 상태 필드 추가 (서버 업데이트 필요)
export type JoinRoomSuccessData = {
  // ... 기존 필드들
  chatRoom: {
    // ... 기존 필드들
    userLeft?: boolean     // 🆕 추가
    lawyerLeft?: boolean   // 🆕 추가
  }
}
```

### 2. WebSocket 이벤트 처리 (`useChatSocket.ts`)

#### A. userLeft 이벤트 핸들러

```typescript
const handleUserLeft = (data: UserLeftData) => {
  console.log('🟢 userLeft 이벤트 수신:', data)
  
  let messageContent = ''
  if (!data.chatRoomIsActive) {
    // 양쪽 모두 나간 경우
    messageContent = '채팅이 종료되었습니다.'
    setChatStatus('COMPLETED')
  } else {
    // 한쪽만 나간 경우 (일방향 채팅)
    const leftUserType = data.userLeft ? '사용자' : '변호사'
    messageContent = `${leftUserType}가 채팅을 나갔습니다.`
    
    const currentUserLeft = (isLawyer && data.lawyerLeft) || (!isLawyer && data.userLeft)
    
    if (currentUserLeft) {
      setChatStatus('COMPLETED')  // 내가 나간 경우
    } else {
      setChatStatus('PARTIAL_LEFT')  // 상대방이 나간 경우
    }
  }
  
  // 시스템 메시지 생성
  const leaveMessage: ChatMessage = {
    chatMessageId: Date.now(),
    chatMessageContent: messageContent,
    chatMessageSenderType: 'LAWYER', // 시스템 메시지
    chatMessageSenderId: 0,
    chatMessageCreatedAt: new Date().toISOString(),
  }
  
  addMessage(leaveMessage)
}
```

#### B. joinRoomSuccess에서 나가기 상태 확인

```typescript
const handleJoinRoomSuccess = (data: JoinRoomSuccessData) => {
  // ... 기존 로직

  // 🆕 채팅방 입장 시 나가기 상태 확인 및 처리
  const { userLeft, lawyerLeft, chatRoomIsActive } = data.chatRoom
  
  if (userLeft !== undefined && lawyerLeft !== undefined) {
    if (!chatRoomIsActive) {
      setChatStatus('COMPLETED')
      // 종료 시스템 메시지 생성
    } else if (userLeft || lawyerLeft) {
      const leftUserType = userLeft ? '사용자' : '변호사'
      const currentUserLeft = (isLawyer && lawyerLeft) || (!isLawyer && userLeft)
      
      if (currentUserLeft) {
        setChatStatus('COMPLETED')
      } else {
        setChatStatus('PARTIAL_LEFT')  // 일방향 채팅
      }
      
      // 나가기 시스템 메시지 생성
    } else {
      setChatStatus(data.chatRoom.chatRoomStatus)
    }
  }
}
```

### 3. UI 구현 (`ChatBody.tsx`)

#### A. 상태별 입력창 렌더링

```tsx
{/* 채팅 입력창 또는 상태 메시지 */}
{chatStatus === 'COMPLETED' ? (
  <div className={styles['chat-disabled']}>
    <p>채팅이 종료되었습니다.</p>
  </div>
) : chatStatus === 'PARTIAL_LEFT' ? (
  <div className={styles['chat-partial-left']}>
    <p>상대방이 채팅을 나갔습니다. 메시지를 보낼 수 있지만 답장은 받을 수 없습니다.</p>
    <InputBox
      // ... 입력창 props (여전히 활성화)
      disabled={!isConnected}
    />
  </div>
) : (
  <InputBox
    // ... 정상 입력창
  />
)}
```

#### B. 시스템 메시지 렌더링

```tsx
// 시스템 메시지 체크
const isSystemMessage =
  msg.chatMessageSenderId === 0 &&
  (msg.chatMessageContent.includes('상담을 종료했습니다') || 
   msg.chatMessageContent.includes('나갔습니다') ||
   msg.chatMessageContent.includes('종료되었습니다'))

if (isSystemMessage) {
  return (
    <div key={msg.chatMessageId} className={styles['system-message']}>
      <span className={styles['system-message-text']}>
        {msg.chatMessageContent}
      </span>
      <span className={styles['system-message-time']}>
        {formatTimeAgo(msg.chatMessageCreatedAt)}
      </span>
    </div>
  )
}
```

### 4. CSS 스타일링 (`chatBody.module.scss`)

```scss
// 채팅 종료 상태
.chat-disabled {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin: 1rem 0;
  border-top: 1px solid #e0e0e0;
  
  p {
    color: #666;
    font-size: 0.9rem;
    margin: 0;
    text-align: center;
  }
}

// 일방향 채팅 상태
.chat-partial-left {
  border-top: 1px solid #e0e0e0;
  background-color: #fff9e6;
  
  p {
    padding: 0.75rem 1rem;
    margin: 0;
    background-color: #fff3cd;
    color: #856404;
    font-size: 0.875rem;
    text-align: center;
    border-bottom: 1px solid #ffeaa7;
  }
}

// 시스템 메시지
.system-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
  padding: 0.5rem 1rem;
}

.system-message-text {
  background-color: #f5f5f5;
  color: #666;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  text-align: center;
  max-width: 80%;
  word-break: break-word;
}
```

## ✅ 테스트 시나리오

### 1. 실시간 나가기 (둘 다 온라인)
1. 유저와 변호사가 채팅 중
2. 유저가 "나가기" 버튼 클릭
3. **변호사 화면**: "사용자가 채팅을 나갔습니다" 시스템 메시지 표시
4. **변호사 화면**: 노란색 일방향 채팅 안내 메시지 + 입력창 여전히 활성화
5. **유저 화면**: 소켓 연결 해제 + "채팅이 종료되었습니다" 표시

### 2. 나중 접속 (서버 업데이트 후)
1. 유저가 나간 상태에서 변호사가 나중에 접속
2. `joinRoomSuccess`에서 `userLeft: true` 확인
3. 자동으로 시스템 메시지 생성 및 `PARTIAL_LEFT` 상태 설정

### 3. 완전 종료
1. 한쪽이 이미 나간 상태에서 다른 쪽도 나가기
2. `chatRoomIsActive: false` 상태
3. 양쪽 모두 "채팅이 종료되었습니다" 표시

## 🚨 주의사항 및 제한사항

### 현재 제한사항
1. **서버 API 미완성**: `joinRoomSuccess`에 `userLeft`, `lawyerLeft` 필드가 없어서 나중 접속 시 상태 확인 불가
2. **실시간 의존**: 현재는 실시간 `userLeft` 이벤트에만 의존

### 서버 개발팀 요청사항
```json
// joinRoomSuccess 응답에 추가 필요
{
  "chatRoom": {
    "chatRoomStatus": "ACTIVE",
    "chatRoomIsActive": true,
    "userLeft": true,      // 🆕 추가 필요
    "lawyerLeft": false    // 🆕 추가 필요
  }
}
```

### 디버깅 방법
1. **콘솔 로그 확인**: `🟢 userLeft 이벤트 수신:` 로그가 나타나는지 확인
2. **네트워크 탭**: WebSocket 메시지에서 `userLeft` 이벤트 확인
3. **상태 추적**: `setChatStatus` 호출 및 UI 업데이트 확인

## 🎯 성공 기준

- ✅ 유저가 나가면 변호사에게 실시간 알림 전달
- ✅ 시스템 메시지로 나가기 상태 표시  
- ✅ 일방향 채팅 상태에서 입력창 활성화 유지
- ✅ 시각적으로 구분되는 UI (노란색 안내)
- ⚠️ 나중 접속 시에도 상태 확인 가능 (서버 업데이트 필요)