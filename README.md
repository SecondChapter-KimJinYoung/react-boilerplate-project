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
| 코드 품질       | ESLint 9 (Flat Config) + Prettier |      |
| CI/CD           | GitHub Actions                    |      |

## 시작하기

```bash
corepack enable
yarn install
yarn dev        # → http://localhost:5173
```

> 환경변수는 `.env`, `.env.development`, `.env.production`을 확인하세요.

## 스크립트

| 명령어              | 설명                                  |
| ------------------- | ------------------------------------- |
| `yarn dev`          | 개발 서버                             |
| `yarn build`        | 프로덕션 빌드 (타입 체크 포함)        |
| `yarn quality`      | 타입 체크 + 린트 + 포맷 체크 (한번에) |
| `yarn test`         | 테스트 1회 실행                       |
| `yarn test:watch`   | 테스트 watch 모드                     |
| `yarn lint:fix`     | ESLint 자동 수정                      |
| `yarn format`       | Prettier 포맷팅                       |

## 프로젝트 구조

```
src/
├── api/                          # API 레이어
│   ├── api.ts                    #   공통 CRUD 헬퍼 (get, post, put, patch, delete)
│   ├── api.client.ts             #   Axios 인스턴스, 인터셉터, 토큰 갱신
│   ├── api.types.ts              #   공통 API 응답/에러 타입
│   ├── api.constants.ts          #   HTTP 상수, 메시지 상수, 스토리지 키
│   ├── api.endpoints.ts          #   엔드포인트 URL 상수
│   ├── api.utils.ts              #   에러 파싱, 메시지 매핑
│   └── example/                  #   [도메인] API 모듈
│
├── features/                     # 기능 모듈 (FBA)
│   ├── auth/                     #   인증 (LoginPage, NotFoundPage)
│   └── example/                  #   참고용 풀 구조 예시 (DEV 전용)
│
├── shared/                       # 공유 리소스
│   ├── components/               #   UI + 인프라 컴포넌트
│   │   ├── ErrorBoundary.tsx     #     에러 경계 (앱 인프라)
│   │   ├── guards/               #     라우트 가드 (Auth, Protected)
│   │   ├── atoms/                #     Button, Input, Label, Badge ...
│   │   ├── molecules/            #     FormField, SearchInput, Pagination ...
│   │   ├── organisms/            #     Toast, ConfirmDialog
│   │   └── templates/            #     AuthLayout, DashboardLayout
│   ├── stores/                   #   Zustand 스토어
│   ├── constants/                #   query-keys, regex.patterns, navigation
│   └── utils/                    #   cn, lazy, file, toast, regex
│
├── routes/                       # 라우팅 (lazy import)
├── App.tsx                       # QueryProvider + ErrorBoundary + Suspense + Toast
└── main.tsx                      # ReactDOM 진입점
```

## 문서

| 문서 | 내용 |
| ---- | ---- |
| [아키텍처](docs/architecture.md) | FBA + Atomic Design, 상태 관리, API 레이어, 라우트 구조 |
| [컨벤션](docs/conventions.md) | 커밋, 파일 네이밍, 코딩 스타일 |
| [테스트](docs/testing.md) | 테스트 전략, 실행 방법, 커버리지 |
| [CI/CD](docs/ci-cd.md) | GitHub Actions 파이프라인, 배포 조건, 보안 |
| [새 기능 추가](docs/guide-new-feature.md) | 도메인 폴더 생성부터 라우트 등록까지 |
