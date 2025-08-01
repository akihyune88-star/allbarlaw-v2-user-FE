# ⚠️ 에러 코드 및 처리 가이드

## 에러 코드 분류

### HTTP 4xx 클라이언트 에러

| 코드 | HTTP | 설명 | 원인 | 해결 방안 |
|------|------|------|------|-----------|
| 4001 | 400 | 검증 오류 | 잘못된 입력값 | 입력값 검증 후 재요청 |
| 4024 | 404 | 채팅방을 찾을 수 없음 | 존재하지 않는 채팅방 ID | 채팅방 목록에서 유효한 ID 사용 |
| 4025 | 403 | 채팅방 참여 권한 없음 | 다른 사용자의 채팅방 접근 | 본인의 채팅방만 접근 |
| 4026 | 403 | 비활성화된 채팅방 | 종료된 채팅방 접근 | 채팅방 상태 확인 후 접근 |
| 4027 | 404 | 메시지를 찾을 수 없음 | 존재하지 않는 메시지 ID | 유효한 메시지 ID 사용 |
| 4028 | 400 | 이미 나간 채팅방 | 중복 나가기 요청 | 채팅방 상태 확인 |
| 4029 | 403 | 거절된 상담 요청 | 거절된 채팅방 접근 | 수락된 채팅방만 접근 |

### HTTP 5xx 서버 에러

| 코드 | HTTP | 설명 | 원인 | 해결 방안 |
|------|------|------|------|-----------|
| 5001 | 500 | 데이터베이스 연결 오류 | DB 서버 장애 | 재시도 후 지원팀 문의 |
| 5002 | 500 | WebSocket 연결 실패 | 소켓 서버 장애 | 페이지 새로고침 후 재연결 |
| 5003 | 503 | 서비스 일시 중단 | 서버 점검 중 | 점검 완료 후 재접속 |

## 에러 처리 전략

### 클라이언트 사이드 처리

#### REST API 에러 처리
```jsx
const handleApiError = (error) => {
  const { statusCode, message } = error.response.data;
  
  switch(statusCode) {
    case 4024: // 채팅방 없음
      showToast('채팅방을 찾을 수 없습니다.');
      router.push('/chat-list');
      break;
      
    case 4025: // 권한 없음
      showToast('접근 권한이 없습니다.');
      router.push('/chat-list');
      break;
      
    case 4026: // 비활성화된 채팅방
      showToast('종료된 채팅방입니다.');
      setChatRoomInactive(true);
      break;
      
    case 4028: // 이미 나간 채팅방
      showToast('이미 나간 채팅방입니다.');
      router.push('/chat-list');
      break;
      
    default:
      showToast('오류가 발생했습니다. 다시 시도해주세요.');
      logError('API_ERROR', { statusCode, message });
  }
};
```

#### WebSocket 에러 처리
```jsx
socket.on('error', (error) => {
  switch(error.code) {
    case 'UNAUTHORIZED':
      // 토큰 만료 또는 무효
      refreshToken().then(() => {
        reconnectSocket();
      }).catch(() => {
        logout();
      });
      break;
      
    case 'ROOM_NOT_FOUND':
      showToast('채팅방을 찾을 수 없습니다.');
      leaveCurrentRoom();
      break;
      
    case 'PERMISSION_DENIED':
      showToast('권한이 없습니다.');
      leaveCurrentRoom();
      break;
      
    default:
      showToast('연결 오류가 발생했습니다.');
      attemptReconnection();
  }
});
```

### 자동 복구 메커니즘

#### 재시도 로직
```jsx
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, i); // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
```

#### 연결 복구
```jsx
const reconnectionStrategy = {
  maxAttempts: 5,
  currentAttempt: 0,
  baseDelay: 1000,
  
  async attemptReconnection() {
    if (this.currentAttempt >= this.maxAttempts) {
      showPersistentError('연결을 복구할 수 없습니다. 페이지를 새로고침해주세요.');
      return;
    }
    
    this.currentAttempt++;
    const delay = this.baseDelay * Math.pow(2, this.currentAttempt - 1);
    
    showToast(`연결 복구 시도 중... (${this.currentAttempt}/${this.maxAttempts})`);
    
    setTimeout(() => {
      socket.connect();
    }, delay);
  }
};
```

## 사용자 경험 개선

### 에러 메시지 가이드라인

#### 사용자 친화적 메시지
```jsx
const errorMessages = {
  4001: '입력하신 정보를 다시 확인해주세요.',
  4024: '채팅방을 찾을 수 없어요. 목록에서 다시 선택해주세요.',
  4025: '이 채팅방에 접근할 수 없어요.',
  4026: '종료된 채팅방이에요.',
  4027: '메시지를 불러올 수 없어요.',
  4028: '이미 나간 채팅방이에요.',
  4029: '거절된 상담 요청이에요.',
  
  // 일반적인 메시지
  network: '인터넷 연결을 확인해주세요.',
  server: '서버에 문제가 있어요. 잠시 후 다시 시도해주세요.',
  unknown: '예상치 못한 오류가 발생했어요.'
};
```

### 에러 상태 UI

#### 로딩 및 에러 상태 표시
```jsx
const ChatRoom = () => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    retrying: false
  });
  
  if (state.error) {
    return (
      <ErrorStateCard
        message={state.error.message}
        onRetry={() => retryConnection()}
        showRetry={state.error.retryable}
      />
    );
  }
  
  if (state.loading || state.retrying) {
    return <LoadingSpinner message="채팅방에 연결 중..." />;
  }
  
  return <ChatInterface />;
};
```

## 로깅 및 모니터링

### 에러 로깅 전략
```jsx
const errorLogger = {
  logError(type, details, context = {}) {
    const errorData = {
      timestamp: new Date().toISOString(),
      type,
      details,
      context: {
        userId: getCurrentUserId(),
        chatRoomId: getCurrentChatRoomId(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        ...context
      }
    };
    
    // 로컬 스토리지에 임시 저장 (네트워크 오류 시)
    const errors = JSON.parse(localStorage.getItem('errorLog') || '[]');
    errors.push(errorData);
    localStorage.setItem('errorLog', JSON.stringify(errors.slice(-50))); // 최근 50개만 보관
    
    // 서버로 전송 시도
    this.sendToServer(errorData);
  },
  
  async sendToServer(errorData) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      });
      
      // 전송 성공 시 로컬 스토리지에서 제거
      this.clearLocalErrors();
    } catch (error) {
      // 전송 실패 시 로컬에 보관
      console.warn('Error logging failed:', error);
    }
  }
};
```

### 메트릭 수집
- API 에러율 모니터링
- WebSocket 연결 실패율 추적
- 사용자별 에러 패턴 분석
- 에러 복구 성공률 측정