# React Boilerplate Project

React 19 + TypeScript + Vite 기반의 프로덕션 레디 웹 애플리케이션 보일러플레이트입니다.

## 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구 (rolldown-vite)
- **React Router** - 라우팅
- **TanStack Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **Axios** - HTTP 클라이언트
- **Material-UI** - UI 컴포넌트
- **Tailwind CSS** - 유틸리티 CSS
- **ESLint + Prettier** - 코드 품질 관리

## 프로젝트 구조

```
src/
├── api/                    # API 관련
│   ├── api.ts              # Axios 인스턴스 및 인터셉터
│   ├── api.types.ts        # 공통 API 타입
│   ├── api.constants.ts    # API 상수 (엔드포인트, 메시지 등)
│   ├── api.utils.ts        # API 유틸리티 함수
│   └── example/            # Example API 모듈
│       ├── example.api.ts  # Example API 함수
│       └── example.types.ts # Example 타입 정의
│
├── features/               # 기능별 모듈 (Feature-based 구조)
│   └── example/           # Example 기능
│       ├── components/    # 컴포넌트
│       ├── hooks/         # 커스텀 훅
│       ├── constants/     # 기능별 상수
│       ├── utils/         # 기능별 유틸리티
│       └── mocks/         # Mock 데이터
│
├── shared/                 # 공유 리소스
│   ├── components/        # 공통 컴포넌트
│   ├── constants/         # 공통 상수
│   │   ├── query-keys.ts  # React Query 키
│   │   ├── storage-keys.ts # 로컬 스토리지 키
│   │   └── regex/        # 정규표현식 패턴 및 헬퍼
│   └── utils/             # 공통 유틸리티
│       ├── cn.ts          # className 병합
│       ├── file.ts         # 파일 처리
│       ├── format.ts       # 포맷팅 함수
│       └── lazy.tsx        # Lazy loading 헬퍼
│
├── routes/                 # 라우팅
│   ├── router.tsx         # 라우터 설정
│   └── routes.ts          # 라우트 상수
│
├── types/                  # 전역 타입 정의
├── App.tsx                 # 루트 컴포넌트
└── main.tsx                # 진입점
```

## 시작하기

### 설치

```bash
yarn install
```

### 개발 서버 실행

```bash
yarn dev
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

### 빌드

```bash
yarn build
```

### 코드 품질 체크

```bash
yarn quality        # 타입 체크 + 린트 + 포맷팅 체크
yarn quality:fix    # 자동 수정
```

## 스크립트

- `yarn dev` - 개발 서버 실행
- `yarn build` - 프로덕션 빌드
- `yarn type-check` - TypeScript 타입 체크
- `yarn lint` - ESLint 검사
- `yarn lint:fix` - ESLint 자동 수정
- `yarn format` - Prettier 포맷팅
- `yarn format:check` - Prettier 포맷팅 체크
- `yarn predeploy` - 배포 전 품질 체크 + 빌드
