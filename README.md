# React Boilerplate

클론 후 바로 개발을 시작할 수 있는 React 프로덕션 보일러플레이트.

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| UI | React | 19 |
| 언어 | TypeScript (strict) | 5.9 |
| 빌드 | Vite (rolldown-vite) | 7.2 |
| 스타일 | Tailwind CSS | 4 |
| 라우팅 | React Router | 7 |
| 서버 상태 | TanStack React Query | 5 |
| 클라이언트 상태 | Zustand | 5 |
| HTTP | Axios | 1.13 |
| 패키지 매니저 | Yarn Berry | 4.12 |
| 코드 품질 | ESLint 9 (Flat Config) + Prettier |
| CI/CD | GitHub Actions |

## 패키지 매니저

**Yarn Berry 4.x** + **Corepack**을 사용합니다.

- `package.json`의 `packageManager` 필드가 버전을 고정합니다
- `corepack enable` 한 번이면 누가 클론해도 동일한 yarn 버전이 자동 설치됩니다
- `nodeLinker: node-modules` 모드로 기존 node_modules 방식을 유지합니다
- CI에서 `yarn install --immutable`로 lockfile 무결성을 강제합니다

## 아키텍처

### FBA (Feature-Based Architecture) + Atomic Design

```
기능 단위로 코드를 분리하고, 공유 컴포넌트는 Atomic Design으로 분류합니다.
```

**핵심 원칙**:
- 1곳에서만 쓰는 컴포넌트 → `features/` 내부에 배치
- 2곳 이상에서 쓰는 컴포넌트 → `shared/`로 승격
- `features/` 간 직접 import 금지 → 반드시 `shared/`를 경유

### 상태 관리 전략

| 상태 종류 | 도구 | 예시 |
|-----------|------|------|
| 서버 데이터 (조회/캐시) | React Query | API 응답, 목록, 상세 |
| 전역 클라이언트 상태 | Zustand | 인증 정보, 사용자 설정 |
| 지역 UI 상태 | useState/useReducer | 폼 입력, 모달 열기/닫기 |

### API 레이어 전략

```
컴포넌트 → hooks (useQuery/useMutation) → api 함수 → Axios 인스턴스
```

- Axios 인스턴스에 인터셉터 설정 (토큰 주입, 에러 핸들링, 토큰 갱신)
- API 함수는 `api/[도메인]/` 하위에 도메인별로 분리
- 컴포넌트는 API 함수를 직접 호출하지 않고, 반드시 hooks를 경유

## 프로젝트 구조

```
src/
├── api/                          # API 레이어
│   ├── api.ts                    #   Axios 인스턴스, 인터셉터, 토큰 갱신
│   ├── api.types.ts              #   공통 API 응답/에러 타입
│   ├── api.constants.ts          #   HTTP 상수, 스토리지 키
│   ├── api.endpoints.ts          #   엔드포인트 URL 상수
│   ├── api.messages.ts           #   사용자 노출 메시지 상수
│   ├── api.utils.ts              #   에러 파싱, 메시지 매핑
│   └── example/                  #   [도메인] API 모듈
│       ├── example.api.ts        #     CRUD 함수
│       └── example.types.ts      #     요청/응답 타입
│
├── features/                     # 기능 모듈 (FBA)
│   ├── auth/                     #   인증 기능
│   │   └── pages/               #     LoginPage, NotFoundPage
│   │
│   └── example/                  #   Example CRUD (참고용 샘플)
│       ├── pages/                #     라우터가 렌더링하는 페이지 진입점
│       ├── hooks/                #     React Query 훅, 폼 훅
│       ├── constants/            #     기능 전용 상수
│       ├── mocks/                #     Mock 데이터
│       └── utils/                #     기능 전용 유틸
│
├── shared/                       # 공유 리소스
│   ├── components/
│   │   ├── atoms/                #     Button, Input, Select, Checkbox ...
│   │   ├── molecules/            #     FormField, Pagination, SearchInput ...
│   │   ├── organisms/            #     Toast, ConfirmDialog
│   │   ├── guards/               #     ProtectedRoute, AuthRoute
│   │   ├── layouts/              #     DashboardLayout, AuthLayout
│   │   └── ErrorBoundary.tsx
│   ├── stores/                   #   Zustand 스토어 (auth.store.ts)
│   ├── constants/                #   query-keys, regex.patterns
│   └── utils/                    #   cn, lazy, format, file, toast, regex
│
├── routes/                       # 라우팅
│   ├── router.tsx                #   라우트 트리 (lazy import)
│   └── routes.ts                 #   경로 상수
│
├── App.tsx                       # QueryProvider + ErrorBoundary + Suspense + Toast
├── main.tsx                      # ReactDOM 진입점
├── index.css                     # Tailwind + Pretendard 폰트
└── vite-env.d.ts                 # 환경변수 타입 선언
```

## 라우트 구조

| 경로 | 가드 | 레이아웃 | 페이지 |
|------|------|----------|--------|
| `/` | - | - | → `/auth/login` 리다이렉트 |
| `/auth/login` | AuthRoute | AuthLayout | LoginPage |
| `/dashboard` | ProtectedRoute | DashboardLayout | (placeholder) |
| `/example/*` | ProtectedRoute | DashboardLayout | Example CRUD |
| `*` | - | - | NotFoundPage (404) |

- **ProtectedRoute**: 토큰 없으면 → 로그인으로 리다이렉트
- **AuthRoute**: 토큰 있으면 → 대시보드로 리다이렉트

## 파일 네이밍 규칙

| 종류 | 패턴 | 예시 |
|------|------|------|
| 페이지 | `XxxPage.tsx` | `LoginPage.tsx`, `ExampleListPage.tsx` |
| 컴포넌트 | `PascalCase.tsx` | `Button.tsx`, `SearchInput.tsx` |
| 훅 | `useXxx.ts` | `useExample.ts`, `useExampleForm.ts` |
| 유틸 | `[도메인].utils.ts` | `toast.utils.ts`, `regex.utils.ts` |
| 타입 | `[도메인].types.ts` | `api.types.ts`, `example.types.ts` |
| 상수 | `[도메인].constants.ts` | `api.constants.ts`, `example.constants.ts` |
| 스토어 | `[도메인].store.ts` | `auth.store.ts` |
| API 함수 | `[도메인].api.ts` | `example.api.ts` |
| 패턴 | `[도메인].patterns.ts` | `regex.patterns.ts` |

**barrel file (`index.ts`) 사용 안 함** — 직접 경로로 import.

## 시작하기

```bash
# 1. Corepack 활성화 (최초 1회)
corepack enable

# 2. 의존성 설치
yarn install

# 3. 환경변수 설정
# .env, .env.development, .env.production 확인 후 API URL 수정

# 4. 개발 서버 실행
yarn dev
# → http://localhost:3000
```

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `yarn dev` | 개발 서버 실행 |
| `yarn build` | 프로덕션 빌드 (타입 체크 포함) |
| `yarn type-check` | TypeScript 타입 체크 |
| `yarn lint` | ESLint 검사 |
| `yarn lint:fix` | ESLint 자동 수정 |
| `yarn format` | Prettier 포맷팅 |
| `yarn format:check` | Prettier 포맷팅 체크 |
| `yarn quality` | 타입 체크 + 린트 + 포맷 체크 (한번에) |
| `yarn quality:fix` | 린트 수정 + 포맷 수정 (한번에) |

## 새 기능 추가 가이드

```bash
# 1. features/ 하위에 도메인 폴더 생성
src/features/user/
├── pages/          # 라우터가 렌더링하는 페이지 (XxxPage.tsx)
├── components/     # 이 기능 내부에서만 쓰는 UI 조각
├── hooks/          # React Query 훅
├── constants/      # 기능 전용 상수
└── utils/          # 기능 전용 유틸

# 2. API 모듈 생성
src/api/user/
├── user.api.ts     # CRUD 함수
└── user.types.ts   # 요청/응답 타입

# 3. 라우트 등록
src/routes/router.tsx   # lazyImport로 페이지 추가
src/routes/routes.ts    # 경로 상수 추가

# 4. 2곳 이상에서 쓰는 컴포넌트가 생기면
src/shared/components/  # atoms → molecules → organisms 분류
```

## 커밋 컨벤션

### prefix

| prefix | 용도 | 예시 |
|--------|------|------|
| `feat` | 새 기능 | `feat: 로그인 페이지 구현` |
| `fix` | 버그 수정 | `fix: 토큰 갱신 시 무한 루프 해결` |
| `refactor` | 코드 구조 개선 (동작 변경 없음) | `refactor: API 에러 핸들링 분리` |
| `chore` | 설정, 의존성, 빌드 등 | `chore: ESLint 9 마이그레이션` |
| `docs` | 문서 | `docs: README 환경변수 설명 추가` |
| `style` | 포맷팅 (코드 의미 변경 없음) | `style: Prettier 적용` |
| `test` | 테스트 | `test: useExample 훅 단위 테스트` |
| `perf` | 성능 개선 | `perf: 목록 렌더링 최적화` |
| `ci` | CI/CD 설정 | `ci: test job 타임아웃 변경` |

### 형식

```
<prefix>: 주요 메시지 (50자 이내)

* 상세 변경 내용 1
* 상세 변경 내용 2
* 상세 변경 내용 3
```

### 규칙

- 제목은 **한글 OK**, 50자 이내
- 의미 단위로 커밋 분리 (한 커밋에 여러 성격 혼합 금지)
- body는 선택사항, 변경이 많을 때 `*` 리스트로 작성
