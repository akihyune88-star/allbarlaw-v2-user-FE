# CLAUDE.md - 프로젝트 컨텍스트 문서

## 🎯 프로젝트 개요
올바로우 변호사 매칭 플랫폼의 프론트엔드 시스템 - 실시간 채팅 상담 기능 구현

## 📋 API 검토 문서 구조

### Phase 1: 인증 및 REST API 검토
**위치**: `docs/api-review/phase1-auth-rest/`

#### 📁 authentication.md
- JWT 토큰 기반 인증 시스템 검토
- 토큰 구조, 만료 시간, 갱신 메커니즘
- 보안 고려사항 및 테스트 시나리오

#### 📁 rest-api-endpoints.md  
- REST API 엔드포인트별 상세 검토
- 채팅방 목록 조회 (`GET /chat/:userId/rooms`)
- 상담 요청 생성 (`POST /chat/:userId/consultation-request`)
- 채팅방 상태 업데이트 (`POST /chat/:chatRoomId/status`)
- 변호사 채팅 목록 (`GET /lawyer/:lawyerId/chat-rooms`)

### Phase 2: WebSocket 실시간 통신 검토
**위치**: `docs/api-review/phase2-websocket/`

#### 📁 websocket-events.md
- Socket.io 기반 실시간 통신 검토
- 채팅방 관리 이벤트 (joinRoom, leaveRoom)
- 메시지 관리 이벤트 (sendMessage, loadMoreMessages, markAsRead)
- 연결 관리, 성능 최적화, 보안 검토

### Phase 3: 통합 테스트 및 클라이언트 구현
**위치**: `docs/api-review/phase3-integration/`

#### 📁 client-implementation.md
- React + Socket.io 클라이언트 구현 검토
- 상태 관리, 이벤트 핸들링, UI/UX
- 성능 최적화, 보안, 테스트 전략

#### 📁 integration-testing.md
- 전체 시스템 통합 테스트 시나리오
- 성능 테스트, 보안 테스트, 장애 복구 테스트
- 크로스 플랫폼 테스트, 모니터링 및 로깅

### 공통 참조 문서
**위치**: `docs/api-review/shared/`

#### 📁 error-codes.md
- API 에러 코드 정의 및 처리 가이드
- 클라이언트 사이드 에러 처리 전략
- 자동 복구 메커니즘, 사용자 경험 개선
- 로깅 및 모니터링 전략

## 🚀 검토 진행 방법

### Phase 1 검토 항목
- [ ] JWT 토큰 보안성 검증
- [ ] REST API 엔드포인트 테스트
- [ ] 에러 처리 및 응답 형식 확인
- [ ] 권한 기반 접근 제어 검증

### Phase 2 검토 항목  
- [ ] WebSocket 연결 안정성 테스트
- [ ] 실시간 메시지 전달 보장 확인
- [ ] 개별 나가기 기능 검증
- [ ] 일방향 채팅 상태 관리 테스트

### Phase 3 검토 항목
- [ ] 클라이언트 상태 관리 최적화
- [ ] 전체 플로우 통합 테스트
- [ ] 성능 및 확장성 검증
- [ ] 사용자 경험 개선사항 도출

## 🔍 주요 기능별 검토 포인트

### 실시간 채팅 시스템
- **인증**: JWT 토큰 기반 (REST + WebSocket)
- **채팅방 관리**: 생성, 입장, 퇴장, 상태 변경
- **메시지 처리**: 전송, 수신, 읽음 처리, 히스토리 로딩
- **개별 나가기**: 일방향 채팅 지원, 완전 종료 처리

### 상담 요청 시스템
- **다중 변호사 요청**: 선택된 변호사별 개별 채팅방 생성
- **상태 관리**: PENDING → ACCEPTED/REJECTED → ACTIVE
- **알림 시스템**: 실시간 상태 변경 알림

### 에러 처리 시스템
- **복구 가능한 에러**: 자동 재시도, 재연결
- **사용자 에러**: 친화적 메시지, 대안 제시
- **시스템 에러**: 로깅, 모니터링, 알림

## 📝 검토 체크리스트 활용법

각 Phase별 문서의 체크박스를 활용하여 검토 진행 상황을 추적하세요:

```markdown
- [ ] 미완료 항목
- [x] 완료된 항목
```

## 🛠️ 개발 참고사항

### 베이스 URL
- **개발환경**: `http://localhost:3000`
- **WebSocket**: `/chat` 네임스페이스

### 주요 에러 코드
- `4024`: 채팅방 없음
- `4025`: 권한 없음  
- `4026`: 비활성화된 채팅방
- `4028`: 이미 나간 채팅방
- `4029`: 거절된 상담 요청

### 성능 고려사항
- 메시지 가상화 (Virtual Scrolling) 구현
- 무한 스크롤 메시지 로딩
- WebSocket 연결 재시도 로직
- 메모리 사용량 최적화

---

이 문서는 백엔드 API 검토 및 프론트엔드 구현을 위한 컨텍스트 참조용으로 작성되었습니다.
각 Phase별로 체계적인 검토를 진행하여 안정적이고 사용자 친화적인 채팅 시스템을 구현하세요.