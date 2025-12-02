## 주요 변경사항

- Zustand Store를 사용하던 부분을 Context API로 전환
  - 주의 : 렌더 관련 이슈에 유의
  - 상품 선택 값에 대한 데이터들이 유지됨
- 기존에 작성한 RecommendedProducts 컴포넌트처럼 아래에서 위로 올라가며 읽어야 하는 방식 지양
  - 위에서부터 아래로 읽을 수 있도록 리팩토링
- formatNumber는 공통 helper 함수로 분리
- SuspenseQuery를 사용해서 fetch 추상화
- tanstack query의 select 메서드를 통해 데이터 정제 (기존 zustand setter)
- 추천 상품 표시 부분은 ts-pattern으로 조건에 대한 가시성 강화

## 개선사항

- 상품 목록이 선택 가능한 항목으로 변경

## 추상화 레벨 (Granularity Level)

- 적금 계산기
  - Form
- 상품 목록
- 계산 결과
- 추천 상품
