# 새 기능 추가 가이드

## 1. features/ 하위에 도메인 폴더 생성

```
src/features/user/
├── pages/          # 라우터가 렌더링하는 페이지 (XxxPage.tsx)
├── components/     # 이 기능 내부에서만 쓰는 UI 조각
├── hooks/          # React Query 훅
├── constants/      # 기능 전용 상수
├── mocks/          # Mock 데이터
└── utils/          # 기능 전용 유틸
```

## 2. API 모듈 생성

```
src/api/user/
├── user.api.ts     # CRUD 함수
└── user.types.ts   # 요청/응답 타입
```

## 3. 라우트 등록

```
src/routes/router.tsx   # lazyImport로 페이지 추가
src/routes/routes.ts    # 경로 상수 추가
```

## 4. 2곳 이상에서 쓰는 컴포넌트가 생기면

```
src/shared/components/  # atoms → molecules → organisms → templates 분류
```

> **참고**: 모든 하위 폴더를 처음부터 만들 필요 없습니다.
> 필요한 폴더만 생성하세요. (예: `auth/`는 현재 `pages/`만 사용)
> 전체 구조 예시는 `features/example/`을 참고하세요.
