## 컴포넌트 분리

- 적금 계산기
- 탭
- 상품
- 상품 리스트
- 계산 결과
- 추천 상품

## State 관리

- 위 모든 상태는 하나의 Store에서 통합 관리
- 필요 상태
  - UI
    - 현재 탭(Route query Sync)
  - 값
    - 목표 금액, 월 납입액, 저축 기간, 선택 상품 (객체)
- Store내 Action 함수들
  - 선택 상품 업데이트
  - 목표 금액 업데이트
  - 월 납입액 업데이트
  - 저축 기간 업데이트
  - 현재 선택 탭 업데이트

## 데이터 패칭

- Tanstack Query(React Query)를 사용하여 캐싱 및 매핑 처리
- 상품 리스트, 추천 상품 컴포넌트에서 같은 QueryKey로 패칭 및 캐싱 활용

## 예외 처리

- 상품 정보 로딩 실패 시 `상품 정보를 불러오지 못했어요. 다시 시도해 보세요.` 와 함께 `다시 가져오기` 버튼 표시
- 상품 리스트, 추천 상품 컴포넌트를 ErrorBoundary로 감싸 놓고, 위 부분은 fallback UI로 표시

## 컴포넌트 분류

- 상품 정보 컴포넌트는 2가지 컴포넌트 이상에서 사용함으로 `/feature/SavingProductItem.tsx` 같은 형태로 분리

## 필터 로직 순수 함수 분류

- 필터
  - filterMinMonthlyAmount
  - filterMaxMonthlyAmount
  - filterAvailableTerms
- 결과 출력
  - 예상 수익 금액
  - 목표 금액과의 차이
  - 추천 월 납입 금액
