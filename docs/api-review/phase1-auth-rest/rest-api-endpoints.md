# 🌐 REST API 엔드포인트 검토 문서

## API 엔드포인트 목록

### 1. 채팅방 목록 조회

**GET** `/chat/:userId/rooms`

#### 검토 포인트

- [ ] 페이지네이션 성능 (기본값: page=1)
- [ ] 정렬 옵션 적절성 (lastMessageAt, createdAt, updatedAt)
- [ ] 응답 데이터 구조 최적화

#### 테스트 케이스

```bash
# 정상 요청
GET /chat/1/rooms?chatRoomPage=1&chatRoomOrderBy=lastMessageAt&chatRoomSort=desc

# 경계값 테스트
GET /chat/1/rooms?chatRoomPage=999999
GET /chat/1/rooms?chatRoomOrderBy=invalid
```

### 2. 상담 요청 생성

**POST** `/chat/:userId/consultation-request`

#### 검토 포인트

- [ ] 필수 필드 검증 (title, description, subcategoryId)
- [ ] selectedLawyerIds 배열 처리
- [ ] 동시 채팅방 생성 로직

#### 테스트 케이스

```json
// 정상 요청
{
  "consultationRequestTitle": "교통사고 관련 상담",
  "consultationRequestDescription": "상세 내용...",
  "consultationRequestSubcategoryId": 5,
  "selectedLawyerIds": [2, 3, 4, 5]
}

// 에러 케이스
{
  "selectedLawyerIds": [] // 빈 배열
}
```

### 3. 채팅방 상태 업데이트

**POST** `/chat/:chatRoomId/status`

#### 상태 전환 규칙

- PENDING → ACCEPTED/REJECTED
- ACCEPTED → ACTIVE
- REJECTED → (종료)

#### 검토 포인트

- [ ] 상태 전환 규칙 검증
- [ ] 권한 체크 (유저만 수락/거절 가능)
- [ ] 상태 변경 알림 메커니즘

### 4. 변호사 채팅 상담 목록

**GET** `/lawyer/:lawyerId/chat-rooms`

#### 검토 포인트

- [ ] 변호사별 채팅방 필터링
- [ ] 응답 시간 성능
- [ ] 메시지 카운트 정확성

## 공통 검토 사항

### 에러 처리

- [ ] HTTP 상태 코드 일관성
- [ ] 에러 메시지 다국어 지원
- [ ] 에러 로깅 체계

### 성능

- [ ] 응답 시간 모니터링
- [ ] 데이터베이스 쿼리 최적화
- [ ] 캐싱 전략

### 보안

- [ ] SQL 인젝션 방지
- [ ] 권한 기반 접근 제어
- [ ] 입력값 검증 및 sanitization
