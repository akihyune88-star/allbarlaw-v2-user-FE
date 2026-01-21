# EX-ALLBARLAW-V2-FE

올바로(Allbarlaw) 사용자용 프론트엔드 애플리케이션

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | EX-ALLBARLAW-V2-FE |
| 설명 | 올바로 법률 서비스 사용자용 웹 프론트엔드 |
| 대상 사용자 | 일반 사용자, 변호사 |
| 기술 스택 | React 19, TypeScript, Vite |

---

## 주요 기능

### 일반 사용자
- 법률 컨텐츠 조회 (블로그, 영상, 법률지식)
- 법률 용어 사전
- 변호사 검색 및 프로필 조회
- 바로톡 (실시간 법률 상담)
- 통합 검색
- 소셜 로그인 (카카오, 네이버, 구글)

### 변호사
- 변호사 전용 회원가입/온보딩
- 프로필 관리
- 컨텐츠 작성/관리 (블로그, 영상)
- 바로톡 상담 관리

---

## 기술 스택

### Core
- **React** 19.0.0 - UI 라이브러리
- **TypeScript** 5.7.2 - 타입 안정성
- **Vite** 6.2.0 - 빌드 도구

### 상태 관리
- **Zustand** 5.0.3 - 전역 상태
- **React Query** 5.80.2 - 서버 상태

### 스타일링
- **Sass** 1.86.3 - CSS 전처리기

### 폼/유효성
- **React Hook Form** 7.59.0
- **Zod** 3.25.71

### 통신
- **Axios** 1.9.0 - HTTP 클라이언트
- **Socket.IO** 4.8.1 - 실시간 통신

---

## 시작하기

### 사전 요구사항

- Node.js >= 18.0.0
- npm >= 9.0.0

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-org/EX-ALLBARLAW-V2-FE.git
cd EX-ALLBARLAW-V2-FE

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일 편집하여 필요한 값 입력
```

### 개발 서버 실행

```bash
npm run dev
# http://localhost:5173 에서 확인
```

### 빌드

```bash
npm run build
# dist/ 폴더에 빌드 결과물 생성
```

---

## 프로젝트 구조

```
src/
├── assets/          # 정적 리소스 (이미지, 폰트, 아이콘)
├── components/      # 재사용 가능한 UI 컴포넌트
├── constants/       # 상수 정의
├── container/       # 컨테이너 컴포넌트
├── contexts/        # React Context
├── hooks/           # 커스텀 훅
├── lib/             # 라이브러리 설정 (Axios 등)
├── pages/           # 페이지 컴포넌트
├── routes/          # 라우팅 설정
├── services/        # API 서비스
├── stores/          # Zustand 상태 저장소
├── styles/          # 글로벌 스타일
├── types/           # TypeScript 타입 정의
├── utils/           # 유틸리티 함수
├── App.tsx          # 앱 루트 컴포넌트
└── main.tsx         # 앱 엔트리 포인트
```

---

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 시작 (포트: 5173) |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 미리보기 |
| `npm run lint` | ESLint 실행 |
| `npm run prepare` | Husky Git 훅 설정 |

---

## 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `VITE_SERVER_API` | 백엔드 API URL | https://test.allbarlawbiz.com |
| `VITE_AI_SUMMARY_SERVER_API` | AI 서버 URL | https://ai.allbarlaw.com |
| `VITE_REDIRECT_URL` | OAuth 리다이렉트 URL | https://www.allbarlaw.com |
| `VITE_KAKAO_KEY` | 카카오 JavaScript 키 | - |
| `VITE_NAVER_CLIENT_ID` | 네이버 클라이언트 ID | - |
| `VITE_NAVER_CLIENT_SECRET` | 네이버 클라이언트 시크릿 | - |
| `VITE_GOOGLE_CLIENT_ID` | 구글 클라이언트 ID | - |
| `VITE_GOOGLE_CLIENT_SECRET` | 구글 클라이언트 시크릿 | - |

---

## 브랜치 전략

| 브랜치 | 용도 |
|--------|------|
| `main` | 운영 배포 |
| `develop` | 개발 통합 |
| `feature/*` | 기능 개발 |
| `fix/*` | 버그 수정 |
| `hotfix/*` | 긴급 수정 |

---

## 커밋 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다.

```
<type>(<scope>): <subject>

# 예시
feat(auth): 소셜 로그인 기능 추가
fix(blog): 블로그 목록 페이지네이션 오류 수정
docs(readme): 문서 업데이트
```

**Type**: feat, fix, docs, style, refactor, test, chore

---


## 관련 프로젝트

| 프로젝트 | 설명 |
|---------|------|
| EX-ALLBARLAW-V2-FE-ADMIN | 관리자용 프론트엔드 |
| EX-ALLBARLAW-V2-BE | 백엔드 API 서버 |

---

## 라이선스

이 프로젝트는 내부 사용을 위한 것이며, 별도의 라이선스 없이 외부 공개가 금지됩니다.

---

*최종 업데이트: 2024년 12월 24일*
