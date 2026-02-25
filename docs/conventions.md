# 컨벤션

## 커밋

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
```

영향 범위가 명확할 때 `prefix(scope):` 형태로 scope를 추가할 수 있습니다.

### 규칙

- 제목은 **한글 OK**, 50자 이내
- 의미 단위로 커밋 분리 (한 커밋에 여러 성격 혼합 금지)
- body는 선택사항, 변경이 많을 때 `*` 리스트로 작성

## 파일 네이밍

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

## 패키지 매니저

**Yarn Berry 4.x** + **Corepack**을 사용합니다.

- `package.json`의 `packageManager` 필드가 버전을 고정합니다
- `corepack enable` 한 번이면 누가 클론해도 동일한 yarn 버전이 자동 설치됩니다
- `nodeLinker: node-modules` 모드로 기존 node_modules 방식을 유지합니다
- CI에서 `yarn install --immutable`로 lockfile 무결성을 강제합니다
