# 아키텍처

## FBA (Feature-Based Architecture) + Atomic Design

기능 단위로 코드를 분리하고, 공유 컴포넌트는 Atomic Design으로 분류합니다.

**핵심 원칙**:

- 1곳에서만 쓰는 컴포넌트 → `features/` 내부에 배치
- 2곳 이상에서 쓰는 컴포넌트 → `shared/`로 승격
- `features/` 간 직접 import 금지 → 반드시 `shared/`를 경유

## 상태 관리 전략

| 상태 종류               | 도구                | 예시                    |
| ----------------------- | ------------------- | ----------------------- |
| 서버 데이터 (조회/캐시) | React Query         | API 응답, 목록, 상세    |
| 전역 클라이언트 상태    | Zustand             | 인증 정보, 사용자 설정  |
| 지역 UI 상태            | useState            | 폼 입력, 모달 열기/닫기 |

## API 레이어 전략

```
컴포넌트 → hooks (useQuery/useMutation) → api 함수 → Axios 인스턴스
```

- Axios 인스턴스에 인터셉터 설정 (토큰 주입, 에러 핸들링, 토큰 갱신)
- API 함수는 `api/[도메인]/` 하위에 도메인별로 분리
- 컴포넌트는 API 함수를 직접 호출하지 않고, 반드시 hooks를 경유

## 라우트 구조

| 경로          | 가드           | 레이아웃        | 페이지                     |
| ------------- | -------------- | --------------- | -------------------------- |
| `/`           | -              | -               | → `/auth/login` 리다이렉트 |
| `/auth/login` | AuthRoute      | AuthLayout      | LoginPage                  |
| `/dashboard`  | ProtectedRoute | DashboardLayout | (placeholder)              |
| `/example/*`  | ProtectedRoute | DashboardLayout | Example CRUD (DEV 전용)    |
| `*`           | -              | -               | NotFoundPage (404)         |

- **ProtectedRoute**: 토큰 없으면 → 로그인으로 리다이렉트
- **AuthRoute**: 토큰 있으면 → 대시보드로 리다이렉트
