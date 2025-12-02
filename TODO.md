# 리팩토링 TODO

## 1. Zustand → Context API 전환

### 현재 상태
```typescript
// src/store/useSavingProductStore.ts
const useSavingProductStore = create<SavingProductStore>(set => ({
  targetAmount, monthlyPayment, savingsPeriod, selectedProduct, currentTab,
  setTargetAmount, setMonthlyPayment, setSavingsPeriod, setSelectedProduct, setCurrentTab
}))
```

### 변경 계획
```typescript
// src/context/SavingProductContext.tsx

// 1. Context 생성
const SavingProductContext = createContext<SavingProductContextType | null>(null)

// 2. Provider 컴포넌트
const SavingProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(savingProductReducer, initialState)
  // 또는 개별 useState 사용
  const [targetAmount, setTargetAmount] = useState(0)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  // ...

  // 메모이제이션으로 불필요한 리렌더 방지
  const value = useMemo(() => ({
    state,
    actions: { setTargetAmount, ... }
  }), [state])

  return <SavingProductContext.Provider value={value}>{children}</SavingProductContext.Provider>
}

// 3. 커스텀 훅
const useSavingProduct = () => {
  const context = useContext(SavingProductContext)
  if (!context) throw new Error('Provider 필요')
  return context
}
```

### 렌더 최적화 주의사항
- [ ] 상태 변경 시 불필요한 리렌더 방지 → `useMemo`, `useCallback` 활용
- [ ] 필요 시 상태 분리 (예: form 상태 vs UI 상태 분리)
- [ ] 컴포넌트에서 필요한 상태만 구독하도록 설계

### 작업 항목
- [ ] `src/context/SavingProductContext.tsx` 생성
- [ ] Provider를 App 또는 필요한 범위에 감싸기
- [ ] 기존 `useSavingProductStore` 사용처를 `useSavingProduct`로 교체
  - `SavingsCalculatorForm.tsx`
  - `SavingsProductList.tsx`
  - `CalculationResult.tsx`
  - `RecommendedProducts.tsx`
  - `SavingsCalculatorTabs.tsx`
- [ ] 기존 store 파일 삭제

---

## 2. 코드 가독성 개선 (위→아래 읽기)

### 현재 문제점 (RecommendedProducts.tsx 예시)
```typescript
// 아래에서 정의된 컴포넌트를 위에서 사용 → 위아래 왔다갔다 읽어야 함
const RecommendedProductsContent = () => { ... }  // 14번 줄

export const RecommendedProducts = () => {        // 87번 줄
  return (
    <ErrorBoundary>
      <Suspense>
        <RecommendedProductsContent />  // ← 위로 올라가서 봐야 함
      </Suspense>
    </ErrorBoundary>
  )
}
```

### 변경 계획
```typescript
// 방법 1: 메인 export를 파일 상단에 배치하고 내부 컴포넌트는 하단에
export const RecommendedProducts = () => {
  return (
    <ErrorBoundary FallbackComponent={SavingProductErrorFallback}>
      <Suspense fallback={<LoadingFallback />}>
        <Content />
      </Suspense>
    </ErrorBoundary>
  )
}

// 방법 2: 내부 컴포넌트를 같은 파일 하단 또는 별도 파일로 분리
const Content = () => { ... }
const LoadingFallback = () => { ... }

// 방법 3: 프로퍼티로 연관 컴포넌트 묶기
RecommendedProducts.Content = Content
RecommendedProducts.Loading = LoadingFallback
```

### 작업 항목
- [ ] `RecommendedProducts.tsx` 구조 개선
- [ ] `SavingsProductList.tsx` 구조 확인 및 개선
- [ ] `CalculationResult.tsx` 구조 확인 및 개선
- [ ] 기타 아래→위로 읽어야 하는 컴포넌트 수정

---

## 3. formatNumber 공통 헬퍼로 분리

### 현재 상태
```typescript
// SavingsCalculatorForm.tsx:5
const formatNumber = (value: number): string => {
  if (value === 0) return ''
  return value.toLocaleString('ko-KR')
}

// RecommendedProducts.tsx:10
const formatNumber = (value: number): string => {
  return value.toLocaleString('ko-KR')
}
```

### 변경 계획
```typescript
// src/utils/format.ts (또는 src/helpers/format.ts)

export const formatNumber = (value: number, options?: { emptyOnZero?: boolean }): string => {
  if (options?.emptyOnZero && value === 0) return ''
  return value.toLocaleString('ko-KR')
}

// 사용처
import { formatNumber } from '@/utils/format'

formatNumber(targetAmount, { emptyOnZero: true })  // Form용
formatNumber(product.minMonthlyAmount)             // 일반 표시용
```

### 작업 항목
- [ ] `src/utils/format.ts` 생성
- [ ] `formatNumber` 함수 통합 (옵션 파라미터로 유연하게)
- [ ] 기존 사용처 import 경로 변경
  - `SavingsCalculatorForm.tsx`
  - `RecommendedProducts.tsx`
  - 기타 숫자 포맷이 필요한 곳

---

## 4. SuspenseQuery를 통한 fetch 추상화

### 현재 상태
```typescript
// hooks/useSavingsProducts.ts
export const useSavingsProducts = () => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.SAVINGS_PRODUCTS,
    queryFn: getSavingsProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
```

### 변경 계획
```typescript
// lib/SuspenseQuery.tsx (또는 hooks/useSuspenseQueryWrapper.ts)

// 방법 1: 컴포넌트 기반 추상화
interface SuspenseQueryProps<T> {
  queryKey: QueryKey
  queryFn: () => Promise<T>
  children: (data: T) => ReactNode
  select?: (data: T) => unknown
}

const SuspenseQuery = <T,>({ queryKey, queryFn, children, select }: SuspenseQueryProps<T>) => {
  const { data } = useSuspenseQuery({ queryKey, queryFn, select })
  return <>{children(data)}</>
}

// 사용 예시
<SuspenseQuery queryKey={QUERY_KEYS.SAVINGS_PRODUCTS} queryFn={getSavingsProducts}>
  {(products) => <ProductList products={products} />}
</SuspenseQuery>

// 방법 2: 훅 기반 추상화 (select 옵션 활용)
const useSavingsProducts = <TSelect = SavingsProduct[]>(
  select?: (data: SavingsProduct[]) => TSelect
) => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.SAVINGS_PRODUCTS,
    queryFn: getSavingsProducts,
    select,
  })
}
```

### 작업 항목
- [ ] `SuspenseQuery` 컴포넌트 또는 추상화 훅 생성
- [ ] 기존 `useSavingsProducts` 훅에 select 옵션 지원 추가
- [ ] 사용처에서 select를 통한 데이터 정제 적용

---

## 5. TanStack Query select로 데이터 정제

### 현재 상태
```typescript
// RecommendedProducts.tsx
const { data: products } = useSavingsProducts()

// 컴포넌트 내에서 직접 필터링 및 정렬
const filteredProducts = filterProductsForRecommendation(products, monthlyPayment, savingsPeriod)
const recommendedProducts = filteredProducts
  .map(product => ({ product, recommendedPayment: calculate(...) }))
  .sort((a, b) => b.product.annualRate - a.product.annualRate)
```

### 변경 계획
```typescript
// hooks/useSavingsProducts.ts

// 기본 훅 (select 옵션 지원)
export const useSavingsProducts = <TSelect = SavingsProduct[]>(
  select?: (data: SavingsProduct[]) => TSelect
) => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.SAVINGS_PRODUCTS,
    queryFn: getSavingsProducts,
    select,
  })
}

// 특화된 훅 (추천 상품용)
export const useRecommendedProducts = (
  monthlyPayment: number,
  savingsPeriod: number,
  targetAmount: number
) => {
  return useSavingsProducts((products) => {
    return filterProductsForRecommendation(products, monthlyPayment, savingsPeriod)
      .map(product => ({
        product,
        recommendedPayment: calculateRecommendedMonthlyPayment(
          targetAmount, savingsPeriod, product.annualRate
        )
      }))
      .sort((a, b) => b.product.annualRate - a.product.annualRate)
      .slice(0, 2)
  })
}

// RecommendedProducts.tsx에서 사용
const { data: recommendedProducts } = useRecommendedProducts(
  monthlyPayment, savingsPeriod, targetAmount
)
```

### 작업 항목
- [ ] `useSavingsProducts` 훅에 제네릭 select 지원 추가
- [ ] `useRecommendedProducts` 등 특화 훅 생성 (필요시)
- [ ] `useFilteredProducts` 훅 생성 (상품 목록용, 필요시)
- [ ] 컴포넌트에서 데이터 정제 로직 제거 → 훅으로 이동

---

## 6. 개선사항: 상품 목록 선택 가능하도록 변경

### 현재 상태
```typescript
// RecommendedProducts.tsx:79
<ListRow onClick={() => {}} />  // 빈 핸들러
```

### 변경 계획
```typescript
// 추천 상품 목록에서 상품 선택 시 동작 정의
<ListRow
  onClick={() => {
    setSelectedProduct(product)
    // 필요시 탭 전환 또는 다른 액션
  }}
/>
```

### 작업 항목
- [ ] 추천 상품 클릭 시 해당 상품 선택되도록 구현
- [ ] 선택된 상품 시각적 피드백 (체크 아이콘 등)
- [ ] UX 고려: 선택 후 어떤 동작을 할지 결정

---

## 작업 순서 권장

1. **formatNumber 헬퍼 분리** (가장 간단, 의존성 없음)
2. **코드 가독성 개선** (구조 변경, 기능 변경 없음)
3. **TanStack Query select 적용** (데이터 흐름 개선)
4. **SuspenseQuery 추상화** (3번과 연계)
5. **Zustand → Context 전환** (가장 큰 변경, 신중히)
6. **상품 선택 기능 개선** (기능 추가)

---

## 체크리스트

- [ ] 모든 변경 후 기존 기능 정상 동작 확인
- [ ] 렌더링 성능 이슈 없는지 React DevTools로 확인
- [ ] TypeScript 타입 에러 없는지 확인
- [ ] 불필요한 import/export 정리
