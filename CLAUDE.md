# CLAUDE.md - 프로젝트 컨텍스트 문서

## 🎯 프로젝트 개요
올바로우 변호사 매칭 플랫폼의 프론트엔드 시스템 - 실시간 채팅 상담 기능 구현

## 🔐 Auth 페이지 레이아웃 표준

### 공통 레이아웃 구조
모든 인증 관련 페이지(회원가입, 아이디 찾기, 비밀번호 찾기 등)는 다음의 표준 레이아웃을 따릅니다:

```tsx
// 기본 구조
<main className={`${styles['page-main']} center-layout`}>
  <SignUpTitle title='페이지 타이틀' />
  <div className={styles['page-section']}>
    {/* 카드 내부 컨텐츠 */}
  </div>
</main>
```

### 스타일 규격
```scss
// 메인 컨테이너
.page-main {
  padding-top: 3.875rem; // 상단 패딩
}

// 카드 섹션
.page-section {
  margin-top: 3.0625rem; // 타이틀과 카드 간격
  width: 34rem;          // 544px 고정 너비
  background-color: $color-white;
  padding: 2.625rem;     // 42px 내부 패딩
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

// 모바일 반응형
@media (max-width: $breakpoint-desktop) {
  .page-main {
    padding-top: 0;
  }
  
  .page-section {
    margin-top: 0.25rem;
    width: 100%;
    padding: 1.5rem 1.25rem;
  }
}
```

### 구현 예시
- `src/pages/auth/signUp/signUpForm/SignUpForm.tsx` - 회원가입
- `src/pages/auth/findId/FindId.tsx` - 아이디 찾기

### 주요 특징
1. **타이틀**: `SignUpTitle` 컴포넌트 재사용
2. **카드 디자인**: 흰색 배경, 그림자 없음, 둥근 모서리
3. **중앙 정렬**: `center-layout` 클래스로 화면 중앙 배치
4. **일관된 간격**: 타이틀-카드 간 49px, 카드 내부 패딩 42px

### 사용 시 주의사항
- 카드 내부 컨텐츠만 변경하고 외부 레이아웃은 유지
- `PhoneInput` 컴포넌트 사용 시 기존 스타일 적용
- 버튼은 카드 하단에 전체 너비로 배치

## 📌 Keep 기능 캐시 관리 전략

### 개요
Keep(북마크) 기능은 Blog, Video, Knowledge 엔티티에서 사용되며, 낙관적 업데이트와 React Query 캐시 동기화를 통해 구현됩니다.

### 구현 패턴

#### 1. 낙관적 업데이트 (Optimistic Update)
```typescript
// 컴포넌트에서의 사용 예시
const handleKeep = () => {
  // 즉시 UI 업데이트
  setIsKeep(prevState => !prevState)
  // 서버 요청
  changeKeep(itemId)
}
```

#### 2. 캐시 업데이트 전략
Keep mutation 성공 시 다음 캐시들을 업데이트:
- **무한 스크롤 리스트 캐시**: `[QUERY_KEY.ENTITY_LIST, 'infinite']`
- **일반 리스트 캐시**: `[QUERY_KEY.ENTITY_LIST]`
- **상세 페이지 캐시**: `[QUERY_KEY.ENTITY_DETAIL, id]`

#### 3. Hook 구현 패턴
```typescript
export const useEntityKeep = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => service.changeKeep(id),
    onSuccess: (data, id) => {
      // 무한 스크롤 캐시 업데이트
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEY.LIST, 'infinite'] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              data: page.data?.map(item =>
                item.id === id ? { ...item, isKeep: data.isKeep } : item
              ) || [],
            })),
          }
        }
      )
      
      // 일반 리스트 캐시 업데이트
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEY.LIST] },
        (oldData: any) => {
          if (!oldData?.data) return oldData
          return {
            ...oldData,
            data: oldData.data.map(item =>
              item.id === id ? { ...item, isKeep: data.isKeep } : item
            ),
          }
        }
      )
      
      onSuccess(data)
    },
    onError: (error) => {
      console.error('Failed to change keep:', error)
      onError?.()
    },
  })
}
```

### 주요 구현 파일
- `src/hooks/queries/useGetBlogList.ts` - Blog Keep hook
- `src/hooks/queries/useGetVideoList.ts` - Video Keep hook  
- `src/hooks/queries/useGetKnowledgeList.ts` - Knowledge Keep hook

### 컴포넌트 구현 패턴

#### 리스트 아이템 컴포넌트
```typescript
const [isKeep, setIsKeep] = useState(item.isKeep)

const { mutate: changeKeep } = useKeep({
  onSuccess: (data) => {
    // 서버 응답으로 최종 상태 확인
    setIsKeep(data.isKeep)
  },
  onError: () => {
    // 에러 시 롤백
    setIsKeep(prevState => !prevState)
  },
})

const handleKeep = (e: React.MouseEvent) => {
  e.stopPropagation() // 이벤트 버블링 방지
  // 낙관적 업데이트
  setIsKeep(prevState => !prevState)
  changeKeep(item.id)
}
```

#### 상세 페이지 컴포넌트
```typescript
const [isKeep, setIsKeep] = useState(false)

// 데이터 로드 시 상태 동기화
useEffect(() => {
  if (data?.isKeep !== undefined) {
    setIsKeep(data.isKeep)
  }
}, [data?.isKeep])
```

### 주의사항

1. **null/undefined 체크 필수**
   - 캐시 업데이트 시 `oldData?.pages`, `oldData?.data` 체크
   - 빈 배열 대비: `page.data?.map() || []`

2. **이벤트 버블링 방지**
   - Keep 버튼 클릭 시 `e.stopPropagation()` 필수
   - 상위 컴포넌트의 onClick 이벤트와 충돌 방지

3. **서버 응답 검증**
   - 서버가 토글된 값을 반환하는지 확인
   - 응답 구조: `{ isKeep: boolean }`

4. **에러 처리**
   - 네트워크 에러 시 UI 롤백
   - 사용자에게 에러 피드백 제공

### 디버깅 팁

1. **로그 추가 위치**
   - Service 레이어: API 요청/응답 로깅
   - Hook 레이어: 캐시 업데이트 전후 상태
   - Component 레이어: 상태 변경 시점

2. **일반적인 문제 해결**
   - Keep 상태가 원복되는 경우: 서버 응답 값 확인
   - 캐시 업데이트 에러: null/undefined 체크 추가
   - 이벤트 중복 발생: stopPropagation 확인

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

## 📚 참조 프로젝트

### EX-ALLBARLAW-V2-FE-ADMIN
**경로**: `C:\Users\lucyl\Desktop\ALLBARLAW\EX-ALLBARLAW-V2-FE-ADMIN`

관리자 페이지 프로젝트로, 다음과 같은 기능들을 참조할 수 있습니다:
- 관리자 전용 UI/UX 패턴
- 데이터 관리 및 CRUD 구현
- 권한 기반 접근 제어
- 통계 및 리포팅 기능

## 🎨 프로젝트 색상 변수

### 주요 색상 (Key Colors)
```scss
$color-green-01: #20bf62;    // 메인 그린
$color-green-02: #23735d;    // 다크 그린
$color-green-hover: #20bf62; // 호버 그린
```

### 텍스트 색상
```scss
$color-text-black: #333333;   // 메인 텍스트
$color-text-index: #6e6e6e;   // 보조 텍스트
$color-text-caption: #999999; // 캡션 텍스트
```

### 아이콘 색상
```scss
$color-icon-black: #333333;      // 블랙 아이콘
$color-icon-gray: #dddddd;       // 그레이 아이콘
$color-icon-gray-50: #bebebe;    // 연한 그레이 아이콘
$color-icon-darkgray: #6a6a6a;   // 진한 그레이 아이콘
$color-icon-green: #20bf62;      // 그린 아이콘
$color-icon-puregreen: #4cd65f;  // 퓨어 그린
$color-icon-lightgreen: #c3e85b; // 라이트 그린
$color-icon-darkgreen: #23735d;  // 다크 그린
```

### 배경 색상
```scss
$color-bg-black: #000000;         // 블랙 배경
$color-bg-gray-01: #eeeeee;       // 그레이 배경 1
$color-bg-gray-02: #f6f7fb;       // 그레이 배경 2
$color-bg-gray-03: #f7f7f7;       // 그레이 배경 3
$color-bg-gray-disable: #c7c7c7;  // 비활성화 배경
$color-bg-gradient-01: #c5e1d1;   // 그라데이션 배경
```

### 기본 색상
```scss
$color-white: #ffffff;       // 흰색
$color-02-orange: #e3872c;   // 오렌지
$color-03-sky: #2cd1e3;      // 스카이 블루
$color-04-blue: #2c69e3;     // 블루
$color-07-black: #504e4f;    // 블랙
```

### 선/테두리 색상
```scss
$color-line-divider: #e6e6e6;      // 구분선
$color-line-borderbox: #d9d9d9;    // 박스 테두리
```

### 중립 색상 (Neutral)
```scss
$color-neutral-50: #f9fafb;
$color-neutral-100: #f3f4f6;
$color-neutral-200: #e5e7eb;
$color-neutral-300: #d1d5db;
$color-neutral-400: #9ca3af;
$color-neutral-500: #6b7280;
$color-neutral-600: #4b5563;
$color-neutral-700: #374151;
$color-neutral-800: #1f2937;
$color-neutral-900: #111827;
```

### 기능 색상
```scss
$color-success: #10b981;  // 성공
$color-warning: #f59e0b;  // 경고
$color-error: #ff0000;    // 에러
$color-info: #3b82f6;     // 정보
```

### 사용 예시
- **버튼**: 활성화 시 `$color-green-01` 사용
- **테두리**: 기본 `$color-line-borderbox`, 포커스 시 `$color-green-01`
- **텍스트**: 메인 `$color-text-black`, 보조 `$color-text-index`
- **배경**: 카드 배경 `$color-white`, 섹션 배경 `$color-bg-gray-02`

### 주의사항
- 새로운 색상 추가 금지 - 반드시 정의된 변수 사용
- 인라인 색상 사용 금지
- 색상 변수 직접 수정 금지

---

이 문서는 백엔드 API 검토 및 프론트엔드 구현을 위한 컨텍스트 참조용으로 작성되었습니다.
각 Phase별로 체계적인 검토를 진행하여 안정적이고 사용자 친화적인 채팅 시스템을 구현하세요.