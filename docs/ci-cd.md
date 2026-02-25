# CI/CD

GitHub Actions 기반 파이프라인. `.github/workflows/ci.yml`에서 관리합니다.

## 실행 흐름

```
install → quality (병렬) → build → deploy (main push만)
        → test   (병렬) ↗       → bundle-report (항상)
```

## 트리거 조건

| 이벤트            | 실행 범위                       |
| ----------------- | ------------------------------- |
| main push         | 전체 파이프라인 (배포 포함)     |
| main 대상 PR      | 품질 검사 + 빌드만 (배포 안 함) |
| workflow_dispatch | 수동 실행                       |

## 파이프라인 상세

| 단계 | Job                   | 내용                                                                                  |
| ---- | --------------------- | ------------------------------------------------------------------------------------- |
| 1    | **Install**           | 의존성 설치 (`--immutable`), 보안 audit (`yarn npm audit --severity high`), 캐시 저장 |
| 2-A  | **Quality** (x3 병렬) | TypeScript 타입 체크, ESLint 검사, Prettier 포맷 체크                                 |
| 2-B  | **Test**              | Vitest 실행 + 커버리지 리포트 생성                                                    |
| 3    | **Build**             | 프로덕션 빌드 + 번들 사이즈 baseline 측정 (main만)                                    |
| 4-A  | **Bundle Report**     | PR에 번들 사이즈 변화량 코멘트                                                        |
| 4-B  | **Deploy**            | SSH로 서버 배포, 헬스체크, 실패 시 자동 롤백                                          |

## 보안

- **Security audit**: install 시 `yarn npm audit --severity high` 실행. CVSS 7.0 이상(high/critical) 취약점이 있으면 CI 실패
- **최소 권한 원칙**: 기본 `contents: read`만 부여, 추가 권한은 필요한 job에서만 개별 선언

## 배포 조건

deploy job은 아래 조건을 **모두** 충족해야 실행됩니다:

1. main 브랜치에 push
2. Repository 변수 `DEPLOY_ENABLED`가 `true`

배포를 활성화하려면 GitHub Settings > Variables에서 `DEPLOY_ENABLED=true` 설정 후, Secrets에 `SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY`를 등록하세요.

## 의도적으로 포함하지 않은 것

| 제외 항목                       | 이유                                                                             |
| ------------------------------- | -------------------------------------------------------------------------------- |
| E2E 테스트 (Playwright/Cypress) | 확정된 유저 플로우가 없는 보일러플레이트 단계. 설치만 100MB+, CI 시간 3~5분 추가 |
| 시각적 회귀 테스트 (VRT)        | 디자인 시스템 미확정 단계, Chromatic/Percy 등 유료 서비스 의존                   |
| Matrix OS 테스트                | 브라우저 SPA — 서버 OS에 의존하지 않음                                           |
| Dependabot/Renovate             | 보일러플레이트 특성상 의존성 변경이 잦아 노이즈가 큼. 실서비스 전환 시 추가 권장 |

실서비스로 전환할 때 유저 플로우가 확정되고, 디자인 시스템이 안정화되면 위 항목을 순차적으로 도입합니다.
