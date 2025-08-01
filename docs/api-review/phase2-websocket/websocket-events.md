# 💬 WebSocket 이벤트 검토 문서 (최신 업데이트: 2025-08-01)

## WebSocket 연결 설정

### 네임스페이스: `/chat`
### 인증: JWT 토큰 via auth 객체
### 상태: ✅ **구현 완료** (useChatSocket.ts)

## 이벤트 분류

### 1. 채팅방 관리 이벤트

#### joinRoom ✅
**송신**: `socket.emit('joinRoom', { chatRoomId, loadRecentMessages, messageLimit })`
**수신**: `joinRoomSuccess`, `joinRoomError`, `userJoined`

##### 구현 상태
- ✅ 중복 입장 처리 로직 (joinRoomAttemptedRef)
- ✅ 최근 메시지 로딩 (기본 50개)
- ✅ 동시 접속자 수 관리
- ✅ 자동 읽음 처리 (500ms 지연)
- 🆕 **나가기 상태 확인 로직 추가** (userLeft, lawyerLeft)

#### leaveRoom ✅
**송신**: `socket.emit('leaveRoom', { chatRoomId })`
**수신**: `leaveRoomSuccess`, `userLeft`

##### 구현 상태  
- ✅ 개별 나가기 vs 전체 종료 로직
- ✅ 일방향 채팅 상태 관리 (PARTIAL_LEFT)
- ✅ 연결 해제 시 자동 나가기
- ✅ REST API + WebSocket 조합 처리

### 2. 메시지 관리 이벤트

#### sendMessage ✅
**송신**: `socket.emit('sendMessage', { chatRoomId, content, receiverId, receiverType, tempId })`
**수신**: `sendMessageSuccess`, `newMessage`, `sendMessageError`

##### 구현 상태
- ✅ tempId를 통한 메시지 상태 추적 (sending → sent → read)
- ✅ 메시지 전송 실패 처리 (sendMessageError)
- ✅ 임시 메시지 UI 표시 및 업데이트
- ✅ 메시지 중복 방지 로직 (자신의 newMessage 스킵)
- ⚠️ 대용량 메시지 처리 (미구현)

#### loadMoreMessages ⚠️
**송신**: `socket.emit('loadMoreMessages', { chatRoomId, lastMessageId, limit })`
**수신**: `messagesLoaded`, `loadMoreMessagesError`

##### 구현 상태
- ⚠️ 클라이언트 미구현 (무한 스크롤 필요시 구현)
- ⚠️ 페이지네이션 성능 테스트 필요
- ⚠️ hasMore 플래그 정확성 확인 필요

#### markAsRead ✅
**송신**: `socket.emit('markAsRead', { chatRoomId, messageIds? })`
**수신**: `markAsReadSuccess`, `messagesMarkedAsRead`

##### 구현 상태
- ✅ 읽음 상태 동기화 (실시간 체크 표시)
- ✅ 자동 읽음 처리 (채팅방 입장 시, 새 메시지 수신 시)
- ✅ useRef를 통한 순환 의존성 해결
- ✅ 상대방 읽음 알림 (messagesMarkedAsRead)

## 🆕 새로 추가된 기능들

### 3. 채팅 나가기 및 상태 관리 이벤트

#### userLeft ✅ (실시간 브로드캐스트)
**수신**: `userLeft` (다른 참여자가 나갔을 때)
**데이터**: `{ chatRoomId, userLeft, lawyerLeft, chatRoomIsActive }`

##### 구현 상태
- ✅ 실시간 나가기 알림 처리
- ✅ 일방향 채팅 상태 설정 (PARTIAL_LEFT)
- ✅ 시스템 메시지 생성 ("사용자가 채팅을 나갔습니다")
- ✅ UI 상태 업데이트 (노란색 안내 메시지)

#### 읽음 상태 시스템 ✅
**기능**: 메시지 전송 상태 및 읽음 확인 시스템

##### 구현 상태
- ✅ 회색 체크: 전송 완료 (상대방 미읽음)
- ✅ 파란색 체크: 상대방 읽음 완료
- ✅ 빨간색 경고: 전송 실패
- ✅ 실시간 읽음 상태 동기화

## 실시간 통신 검토 사항

### 연결 관리 ✅
- ✅ 소켓 연결/해제 처리 (reconnection: false)
- ✅ 연결 상태 추적 (socketConnectedRef)
- ⚠️ 네트워크 끊김 시 자동 재연결 (미구현)
- ⚠️ 하트비트/핑퐁 메커니즘 (서버 의존)

### 메시지 전달 보장 ✅
- ✅ 메시지 전달 확인 (sendMessageSuccess/Error)
- ✅ tempId를 통한 상태 추적
- ✅ 메시지 순서 보장 (타임스탬프 기반)
- ⚠️ 전송 실패 시 재시도 로직 (미구현)

### 성능 최적화 ⚠️
- ✅ 방별 사용자 관리 (joinRoom/leaveRoom)
- ✅ 메시지 중복 방지
- ⚠️ 브로드캐스트 최적화 (서버 의존)
- ⚠️ 메모리 사용량 모니터링 (미구현)

## 에러 처리

### 연결 에러 ✅
- ✅ 인증 실패 처리 (connect_error 이벤트)
- ✅ 네트워크 오류 처리 (disconnect 이벤트)
- ⚠️ 서버 과부하 처리 (미구현)

### 비즈니스 로직 에러 ✅
- ✅ 존재하지 않는 채팅방 (joinRoomError)
- ✅ 권한 없는 접근 (서버 검증)
- ✅ 비활성화된 채팅방 (상태 관리)

## 🎯 핵심 해결된 문제들

### 1. 메시지 중복 렌더링 문제 ✅
**문제**: 메시지 전송 시 2번 렌더링 (임시 메시지 + newMessage)
**해결**: `newMessage` 핸들러에서 자신의 메시지 스킵 처리

### 2. 순환 의존성 문제 ✅  
**문제**: "Cannot access 'markAsRead' before initialization" 에러
**해결**: `useRef` 패턴으로 함수 참조 저장

### 3. 읽음 상태 동기화 ✅
**문제**: 읽음 상태가 실시간으로 반영되지 않음
**해결**: `messagesMarkedAsRead` 이벤트 처리로 실시간 동기화

### 4. 나가기 상태 관리 ✅
**문제**: 한쪽이 나간 후 상대방이 모르는 상황
**해결**: 
- 실시간: `userLeft` 이벤트 브로드캐스트
- 나중 접속: `joinRoomSuccess`에서 나가기 상태 확인 (서버 업데이트 필요)

## 🚀 추가 구현 필요 사항

### 우선순위 높음
- [ ] 서버에서 `joinRoomSuccess`에 `userLeft`, `lawyerLeft` 필드 추가
- [ ] 네트워크 재연결 로직 구현
- [ ] 메시지 전송 실패 시 재시도 기능

### 우선순위 보통  
- [ ] 무한 스크롤 (loadMoreMessages) 구현
- [ ] 파일 첨부 기능
- [ ] 타이핑 인디케이터

### 우선순위 낮음
- [ ] 메시지 검색 기능
- [ ] 채팅방 내 사용자 목록
- [ ] 관리자 기능 (강제 퇴장 등)