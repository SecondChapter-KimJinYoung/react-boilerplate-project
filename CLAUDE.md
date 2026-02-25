# CLAUDE.md

이 파일은 Claude Code가 이 프로젝트에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

React 19 + TypeScript 5.9 (strict) 기반 프로덕션 보일러플레이트.
FBA (Feature-Based Architecture) + Atomic Design 패턴 사용.

| 영역 | 기술 | 비고 |
|------|------|------|
| UI/언어 | React 19 + TypeScript 5.9 (strict) | `noUncheckedIndexedAccess` 활성화 |
| 빌드 | rolldown-vite 7.2 | `vite`를 rolldown-vite로 resolution |
| 스타일 | Tailwind CSS 4 | `cn()` 유틸리티 (clsx + tailwind-merge) |
| 라우팅 | React Router 7 | lazy loading, 중첩 라우트 |
| 서버 상태 | TanStack React Query 5 | query key factory 패턴 |
| 클라이언트 상태 | Zustand 5 | localStorage 동기화 |
| HTTP | Axios 1.13 | 토큰 갱신 큐 패턴, CSRF 방어 |
| 패키지 매니저 | Yarn Berry 4.12 | Corepack, `--immutable` |
| 테스트 | Vitest 4 + jsdom | 대상 파일과 같은 폴더에 `.test.ts` |
| 코드 품질 | ESLint 9 (flat config) + Prettier | `printWidth: 100` |

## 명령어

| 명령어 | 설명 |
|--------|------|
| `yarn dev` | 개발 서버 (http://localhost:5173) |
| `yarn build` | 프로덕션 빌드 (`tsc -b && vite build`) |
| `yarn type-check` | TypeScript 타입 체크 (`tsc --noEmit`) |
| `yarn lint` | ESLint 검사 |
| `yarn lint:fix` | ESLint 자동 수정 |
| `yarn format` | Prettier 포맷팅 |
| `yarn format:check` | Prettier 체크 |
| `yarn quality` | 타입 체크 + 린트 + 포맷 체크 (한번에) |
| `yarn test` | 테스트 1회 실행 |
| `yarn test:watch` | 테스트 watch 모드 |
| `yarn test:coverage` | 테스트 + 커버리지 |

**코드 변경 후 반드시**: `yarn quality` → `yarn test` 순서로 확인.
**단일 테스트**: `yarn vitest run src/path/to/file.test.ts`

## 아키텍처 규칙

### 디렉토리 구조 원칙
- `features/[도메인]/` — 해당 도메인에서만 사용하는 코드
- `shared/` — 2곳 이상에서 사용하는 코드 (atoms → molecules → organisms)
- `api/[도메인]/` — API 함수와 요청/응답 타입
- **features 간 직접 import 금지** — 반드시 `shared/`를 경유

### API 레이어 흐름
```
컴포넌트 → hooks (useQuery/useMutation) → api 함수 → Axios 인스턴스
```
- 컴포넌트는 API 함수를 직접 호출하지 않음. 반드시 hooks 경유
- API 함수는 `api/[도메인]/[도메인].api.ts`에 객체 리터럴로 정의
- 엔드포인트: `api/api.endpoints.ts`에 중앙 관리
- Query key: `shared/constants/query-keys.ts`에 factory 패턴

### 상태 관리
| 상태 종류 | 도구 | 예시 |
|-----------|------|------|
| 서버 데이터 | React Query | API 응답, 목록, 상세 |
| 전역 클라이언트 | Zustand | 인증, 사용자 설정 |
| 지역 UI | useState | 폼 입력, 모달 |

### 라우트 등록
- `routes/routes.ts`에 경로 상수 추가
- `routes/router.tsx`에 `lazyImport`로 페이지 등록
- 인증 필요: `ProtectedRoute` > `DashboardLayout` 하위
- 비로그인 전용: `AuthRoute` > `AuthLayout` 하위

## 파일 네이밍 규칙

| 종류 | 패턴 | 예시 |
|------|------|------|
| 페이지 | `XxxPage.tsx` | `LoginPage.tsx`, `UserListPage.tsx` |
| 컴포넌트 | `PascalCase.tsx` | `Button.tsx`, `SearchInput.tsx` |
| 훅 | `useXxx.ts` | `useUser.ts`, `useUserForm.ts` |
| API 함수 | `[도메인].api.ts` | `user.api.ts` |
| API 타입 | `[도메인].types.ts` | `user.types.ts` |
| 유틸 | `[도메인].utils.ts` | `toast.utils.ts` |
| 상수 | `[도메인].constants.ts` | `user.constants.ts` |
| 스토어 | `[도메인].store.ts` | `auth.store.ts` |
| 테스트 | `[파일명].test.ts` | `regex.utils.test.ts` |

**barrel file (index.ts) 사용 안 함** — 직접 경로로 import.
**경로 별칭**: `@/` → `./src` (예: `@/shared/utils/cn`)

## 코딩 스타일

### TypeScript
- 타입 전용 import는 `import type { ... }` 으로 분리 (`verbatimModuleSyntax`)
- 인터페이스는 `interface`, 유니온/교차/유틸리티는 `type`
- `as const` 적극 활용 (상수 객체, 엔드포인트 등)
- 배열/객체 인덱스 접근 시 undefined 체크 필수 (`noUncheckedIndexedAccess`)
- `any` 금지 → `unknown` + 타입 가드 사용

### React 컴포넌트
- arrow function: `const Component = () => { ... };`
- export: `export default Component;` (파일 하단)
- props: 컴포넌트 파일 내부에 `interface XxxProps` 선언
- HTML 속성 확장: `extends ButtonHTMLAttributes<HTMLButtonElement>`
- 조건부 스타일: `cn()` 유틸리티 사용

### 훅 패턴
- Query: `useXxxQuery`, `useXxxDetail` (useQuery 래퍼)
- Query 목록: `placeholderData: keepPreviousData` 적용 (페이지 전환 시 깜빡임 방지)
- Mutation: `useCreateXxx`, `useUpdateXxx`, `useDeleteXxx`
- Mutation 성공: `queryClient.invalidateQueries` + `showToast`
- 복합 상태: `useXxxList` (페이지네이션, 검색, 선택 등)
- 폼: `useXxxForm` (상태 + 유효성 검증)

### 주석 원칙
- **"왜(why)" 주석만 작성** — 코드가 "무엇(what)"을 하는지는 함수명/변수명으로 표현
- **주석이 필요하면 코드를 먼저 의심** — 이름만으로 의도가 전달되도록 리팩토링 우선
- **JSDoc (`/** */`)은 shared 컴포넌트의 props에만** — 타입만으로 불분명한 기본값/동작 설명 시 사용
- **주석 처리된 코드 금지** — TODO는 허용하되, 예시 코드 블록은 문서로 분리
- JSX 섹션 구분 주석 (`{/* 이메일 */}`) 지양 — Label/id가 이미 역할을 설명

| 주석이 필요한 경우 | 예시 |
|---|---|
| 비직관적인 비즈니스 규칙 | `// 3일 이내 취소만 전액 환불 (정책 v2.3)` |
| 보안/방어 의도 | `// CSRF 방어: 브라우저에서만 설정 가능한 헤더` |
| workaround/우회 | `// Safari date input 빈 문자열 반환 버그 우회` |
| 성능 최적화 근거 | `// O(n²) 회피를 위해 Map으로 사전 인덱싱` |
| 알고리즘/검증 로직 명시 | `// Luhn 알고리즘`, `// 체크섬 검증` |
| 불투명한 코드의 입출력 예시 | `// 01012345678 → 010-1234-5678` (regex 등) |

### Prettier
`printWidth: 100`, `singleQuote: true`, `trailingComma: 'all'`, `endOfLine: 'lf'`, `tabWidth: 2`, `semi: true`

## 커밋 컨벤션

```
prefix(scope): 주요 메시지 (한글 OK, 50자 이내)

* 상세 변경 내용 1
* 상세 변경 내용 2

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

| prefix | 용도 |
|--------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 구조 개선 (동작 변경 없음) |
| `chore` | 설정, 의존성, 빌드 |
| `docs` | 문서 |
| `style` | 포맷팅 (코드 의미 변경 없음) |
| `test` | 테스트 |
| `perf` | 성능 개선 |
| `ci` | CI/CD |

의미 단위로 분리, scope는 영향 범위 명확할 때만, body는 `*` 리스트.

## 테스트 전략

우선순위: 순수 유틸 함수 > 상태/데이터 매핑 > Zustand 스토어.
- 테스트 파일은 대상 파일과 같은 폴더에 `[파일명].test.ts`로 배치
- 단순 래퍼 컴포넌트 (Button, Input)는 테스트 ROI 낮으므로 작성 안 함
- 컴포넌트에 조건 분기/상태 변화/사이드 이펙트가 추가되면 그때 테스트 작성

## 작업 태도 — 코드 품질에 대한 호기심

Claude는 이 프로젝트에서 단순 코드 작성자가 아니라 **성장하는 개발 파트너**로 행동합니다.

### 적극적으로 할 것
- 코드 변경 시 "왜 이 패턴이 좋은지" 근거를 자연스럽게 설명
- 더 나은 방법이 있으면 제안하되, 현재 코드의 맥락을 존중
- 한국 빅테크 (토스, 카카오, 네이버 등) 기술 블로그 사례를 가끔 언급
- 성능, 접근성(a11y), 보안 관점에서 개선점을 부담 없이 제안
- 관련 공식 문서, RFC, 기술 블로그를 "~에서 권장하는 방식입니다" 형태로 간결하게 공유

### 하지 않을 것
- 요청하지 않은 대규모 리팩토링
- 프로젝트 컨벤션을 무시하는 "이론적으로 더 나은" 제안
- 과도한 추상화 권유 (YAGNI 원칙 — 필요할 때 만들기)
