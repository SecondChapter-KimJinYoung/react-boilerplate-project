# React Boilerplate

클론 후 바로 개발을 시작할 수 있는 React 프로덕션 보일러플레이트.

## 기술 스택

| 영역            | 기술                              | 버전 |
| --------------- | --------------------------------- | ---- |
| UI              | React                             | 19   |
| 언어            | TypeScript (strict)               | 5.9  |
| 빌드            | Vite (rolldown-vite)              | 7.2  |
| 스타일          | Tailwind CSS                      | 4    |
| 라우팅          | React Router                      | 7    |
| 서버 상태       | TanStack React Query              | 5    |
| 클라이언트 상태 | Zustand                           | 5    |
| HTTP            | Axios                             | 1.13 |
| 패키지 매니저   | Yarn Berry                        | 4.12 |
| 테스트          | Vitest                            | 4    |
| 코드 품질       | ESLint 9 (Flat Config) + Prettier |
| CI/CD           | GitHub Actions                    |

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

| 명령어               | 설명                                         |
| -------------------- | -------------------------------------------- |
| `yarn dev`           | 개발 서버 실행                               |
| `yarn build`         | 프로덕션 빌드 (타입 체크 포함)               |
| `yarn type-check`    | TypeScript 타입 체크                         |
| `yarn lint`          | ESLint 검사                                  |
| `yarn lint:fix`      | ESLint 자동 수정                             |
| `yarn format`        | Prettier 포맷팅                              |
| `yarn format:check`  | Prettier 포맷팅 체크                         |
| `yarn test`          | 테스트 1회 실행                              |
| `yarn test:watch`    | 테스트 watch 모드 (파일 저장 시 자동 재실행) |
| `yarn test:coverage` | 테스트 + 커버리지 리포트 생성                |
| `yarn quality`       | 타입 체크 + 린트 + 포맷 체크 (한번에)        |
| `yarn quality:fix`   | 린트 수정 + 포맷 수정 (한번에)               |

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

| 상태 종류               | 도구                | 예시                    |
| ----------------------- | ------------------- | ----------------------- |
| 서버 데이터 (조회/캐시) | React Query         | API 응답, 목록, 상세    |
| 전역 클라이언트 상태    | Zustand             | 인증 정보, 사용자 설정  |
| 지역 UI 상태            | useState/useReducer | 폼 입력, 모달 열기/닫기 |

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
│   ├── auth/                     #   인증 기능 (현재 pages만 사용)
│   │   └── pages/                #     LoginPage, NotFoundPage
│   │
│   └── example/                  #   참고용 샘플 — 기능 폴더의 풀 구조 예시
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
│   └── utils/                    #   cn, lazy, file, toast, regex
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

| 경로          | 가드           | 레이아웃        | 페이지                     |
| ------------- | -------------- | --------------- | -------------------------- |
| `/`           | -              | -               | → `/auth/login` 리다이렉트 |
| `/auth/login` | AuthRoute      | AuthLayout      | LoginPage                  |
| `/dashboard`  | ProtectedRoute | DashboardLayout | (placeholder)              |
| `/example/*`  | ProtectedRoute | DashboardLayout | Example CRUD               |
| `*`           | -              | -               | NotFoundPage (404)         |

- **ProtectedRoute**: 토큰 없으면 → 로그인으로 리다이렉트
- **AuthRoute**: 토큰 있으면 → 대시보드로 리다이렉트

## 파일 네이밍 규칙

| 종류     | 패턴                    | 예시                                       |
| -------- | ----------------------- | ------------------------------------------ |
| 페이지   | `XxxPage.tsx`           | `LoginPage.tsx`, `ExampleListPage.tsx`     |
| 컴포넌트 | `PascalCase.tsx`        | `Button.tsx`, `SearchInput.tsx`            |
| 훅       | `useXxx.ts`             | `useExample.ts`, `useExampleForm.ts`       |
| 유틸     | `[도메인].utils.ts`     | `toast.utils.ts`, `regex.utils.ts`         |
| 타입     | `[도메인].types.ts`     | `api.types.ts`, `example.types.ts`         |
| 상수     | `[도메인].constants.ts` | `api.constants.ts`, `example.constants.ts` |
| 스토어   | `[도메인].store.ts`     | `auth.store.ts`                            |
| API 함수 | `[도메인].api.ts`       | `example.api.ts`                           |
| 패턴     | `[도메인].patterns.ts`  | `regex.patterns.ts`                        |

**barrel file (`index.ts`) 사용 안 함** — 직접 경로로 import.

## 새 기능 추가 가이드

```bash
# 1. features/ 하위에 도메인 폴더 생성
src/features/user/
├── pages/          # 라우터가 렌더링하는 페이지 (XxxPage.tsx)
├── components/     # 이 기능 내부에서만 쓰는 UI 조각
├── hooks/          # React Query 훅
├── constants/      # 기능 전용 상수
├── mocks/          # Mock 데이터
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

> **참고**: 모든 하위 폴더를 처음부터 만들 필요 없습니다.
> 필요한 폴더만 생성하세요. (예: `auth/`는 현재 `pages/`만 사용)
> 전체 구조 예시는 `features/example/`을 참고하세요.

## 테스트

**Vitest** + **jsdom** 기반 테스트 환경입니다.

### 실행 방법

```bash
# 전체 테스트 1회 실행
yarn test

# watch 모드 (파일 저장 시 자동 재실행, 개발 중 추천)
yarn test:watch

# 커버리지 리포트 포함 실행
yarn test:coverage
```

### watch 모드 단축키

| 키  | 동작                   |
| --- | ---------------------- |
| `a` | 전체 테스트 실행       |
| `f` | 실패한 테스트만 재실행 |
| `p` | 파일명으로 필터        |
| `t` | 테스트 이름으로 필터   |
| `q` | 종료                   |

### 테스트 파일 규칙

- 테스트 파일은 대상 파일과 **같은 폴더**에 `[파일명].test.ts`로 배치
- 예시: `regex.utils.ts` → `regex.utils.test.ts`
- 설정: `vite.config.ts`의 `test` 블록에서 관리

### 커버리지 확인

`yarn test:coverage` 실행 후 `coverage/index.html`을 브라우저로 열면 파일별/라인별 커버리지를 시각적으로 확인할 수 있습니다.

### 테스트 전략

테스트는 비용 대비 효과가 높은 순서로 점진적으로 확장합니다. 보일러플레이트 단계에서 전수 테스트는 유지보수 비용만 높이고 실질적인 안전망이 되지 않기 때문에, **버그가 나면 파급이 큰 코드**부터 작성합니다.

| 우선순위 | 분류 | 대상 파일 | 테스트 가치 |
|----------|------|-----------|-------------|
| 1순위 | 순수 유틸 함수 | `regex.utils.ts`, `file.ts`, `status.utils.ts` | 입출력 명확, 외부 의존 없음, 버그 시 여러 곳에 파급 |
| 2순위 | 상태/데이터 매핑 | `api.messages.ts`, `api.utils.ts` | 분기 로직이 있고, 잘못되면 사용자에게 엉뚱한 메시지 노출 |
| 3순위 | Zustand 스토어 | `auth.store.ts` | localStorage 연동 로직에 엣지 케이스 존재 (JSON 파싱 실패 등) |
| 작성 안 함 | 단순 래퍼 컴포넌트 | `Button.tsx`, `Input.tsx` 등 | props 전달만 하는 컴포넌트는 테스트 ROI가 낮음 |
| 작성 안 함 | 타입/상수 파일 | `api.types.ts`, `api.constants.ts` 등 | 런타임 로직 없음, 타입 체크가 대신함 |

현재 진행: `regex.utils.test.ts` 완료. 나머지는 기능 개발과 함께 점진적으로 추가합니다.

컴포넌트에 **조건 분기, 상태 변화, 사이드 이펙트**가 추가되는 시점에 해당 컴포넌트의 테스트를 작성합니다.

## CI/CD

GitHub Actions 기반 파이프라인. `.github/workflows/ci.yml`에서 관리합니다.

### 실행 흐름

```
install → quality (병렬) → build → deploy (main push만)
        → test   (병렬) ↗       → bundle-report (항상)
```

### 트리거 조건

| 이벤트            | 실행 범위                        |
| ----------------- | -------------------------------- |
| main push         | 전체 파이프라인 (배포 포함)      |
| main 대상 PR      | 품질 검사 + 빌드만 (배포 안 함)  |
| workflow_dispatch | 수동 실행                        |

### 파이프라인 상세

| 단계 | Job                      | 내용                                                                                     |
| ---- | ------------------------ | ---------------------------------------------------------------------------------------- |
| 1    | **Install**              | 의존성 설치 (`--immutable`), 보안 audit (`yarn npm audit --severity high`), 캐시 저장    |
| 2-A  | **Quality** (x3 병렬)   | TypeScript 타입 체크, ESLint 검사, Prettier 포맷 체크                                    |
| 2-B  | **Test**                 | Vitest 실행 + 커버리지 리포트 생성                                                       |
| 3    | **Build**                | 프로덕션 빌드 + 번들 사이즈 baseline 측정 (main만)                                      |
| 4-A  | **Bundle Report**        | PR에 번들 사이즈 변화량 코멘트                                                           |
| 4-B  | **Deploy**               | SSH로 서버 배포, 헬스체크, 실패 시 자동 롤백                                             |

### 보안

- **Security audit**: install 시 `yarn npm audit --severity high` 실행. CVSS 7.0 이상(high/critical) 취약점이 있으면 CI 실패
- **최소 권한 원칙**: 기본 `contents: read`만 부여, 추가 권한은 필요한 job에서만 개별 선언

### 배포 조건

deploy job은 아래 조건을 **모두** 충족해야 실행됩니다:

1. main 브랜치에 push
2. Repository 변수 `DEPLOY_ENABLED`가 `true`

배포를 활성화하려면 GitHub Settings > Variables에서 `DEPLOY_ENABLED=true` 설정 후, Secrets에 `SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY`를 등록하세요.

### 의도적으로 포함하지 않은 것

이 프로젝트는 보일러플레이트 성격이므로, 비용 대비 효과(ROI)가 낮은 도구는 의도적으로 제외했습니다.

| 제외 항목                        | 이유                                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------- |
| E2E 테스트 (Playwright/Cypress)  | 확정된 유저 플로우가 없는 보일러플레이트 단계. 설치만 100MB+, CI 시간 3~5분 추가         |
| 시각적 회귀 테스트 (VRT)         | 디자인 시스템 미확정 단계, Chromatic/Percy 등 유료 서비스 의존                            |
| Matrix OS 테스트                 | 브라우저 SPA — 서버 OS에 의존하지 않음                                                   |
| Dependabot/Renovate              | 보일러플레이트 특성상 의존성 변경이 잦아 노이즈가 큼. 실서비스 전환 시 추가 권장          |

실서비스로 전환할 때 유저 플로우가 확정되고, 디자인 시스템이 안정화되면 위 항목을 순차적으로 도입합니다.

## 패키지 매니저

**Yarn Berry 4.x** + **Corepack**을 사용합니다.

- `package.json`의 `packageManager` 필드가 버전을 고정합니다
- `corepack enable` 한 번이면 누가 클론해도 동일한 yarn 버전이 자동 설치됩니다
- `nodeLinker: node-modules` 모드로 기존 node_modules 방식을 유지합니다
- CI에서 `yarn install --immutable`로 lockfile 무결성을 강제합니다

## 커밋 컨벤션

### prefix

| prefix     | 용도                            | 예시                               |
| ---------- | ------------------------------- | ---------------------------------- |
| `feat`     | 새 기능                         | `feat: 로그인 페이지 구현`         |
| `fix`      | 버그 수정                       | `fix: 토큰 갱신 시 무한 루프 해결` |
| `refactor` | 코드 구조 개선 (동작 변경 없음) | `refactor: API 에러 핸들링 분리`   |
| `chore`    | 설정, 의존성, 빌드 등           | `chore: ESLint 9 마이그레이션`     |
| `docs`     | 문서                            | `docs: README 환경변수 설명 추가`  |
| `style`    | 포맷팅 (코드 의미 변경 없음)    | `style: Prettier 적용`             |
| `test`     | 테스트                          | `test: useExample 훅 단위 테스트`  |
| `perf`     | 성능 개선                       | `perf: 목록 렌더링 최적화`         |
| `ci`       | CI/CD 설정                      | `ci: test job 타임아웃 변경`       |

### 형식

```
prefix: 주요 메시지 (50자 이내)

* 상세 변경 내용 1
* 상세 변경 내용 2
* 상세 변경 내용 3
```

영향 범위가 명확할 때 `prefix(scope):` 형태로 scope를 추가할 수 있습니다.

```
fix(ci): Corepack을 setup-node보다 먼저 활성화
feat(auth): 이메일 저장 체크박스 추가
```

### 규칙

- 제목은 **한글 OK**, 50자 이내
- 의미 단위로 커밋 분리 (한 커밋에 여러 성격 혼합 금지)
- body는 선택사항, 변경이 많을 때 `*` 리스트로 작성
