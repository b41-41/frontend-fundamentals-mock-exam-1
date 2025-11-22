import { ErrorBoundary } from 'react-error-boundary';
import { colors, ListRow, Spacing } from 'tosslib';
import { SavingProductErrorFallback } from '@/components/SavingProductErrorFallback';
import { SavingProductItem } from '@/features/SavingProduct/SavingProductItem';
import { useSavingsProducts } from '@/hooks/useSavingsProducts';
import { useSavingProductStore } from '@/store/useSavingProductStore';
import { calculateRecommendedMonthlyPayment } from './calculations';

const formatNumber = (value: number): string => {
  return value.toLocaleString('ko-KR');
};

const RecommendedProductsContent = () => {
  const { data: products, isLoading, error } = useSavingsProducts();
  const { targetAmount, savingsPeriod, setMonthlyPayment, setSelectedProduct, setCurrentTab } = useSavingProductStore();

  if (isLoading) {
    return (
      <>
        <Spacing size={16} />
        <div>추천 상품을 찾고 있어요...</div>
        <Spacing size={16} />
      </>
    );
  }

  if (error) {
    throw error;
  }

  if (targetAmount === 0 || savingsPeriod === 0) {
    return (
      <>
        <Spacing size={16} />
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="목표 금액과 저축 기간을 입력해주세요." />} />
        <Spacing size={16} />
      </>
    );
  }

  if (!products || products.length === 0) {
    return (
      <>
        <Spacing size={16} />
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="현재 등록된 적금 상품이 없어요." />} />
        <Spacing size={16} />
      </>
    );
  }

  // 추천 월 납입액 계산 및 필터링된 상품 찾기
  const recommendedProducts = products
    .map(product => {
      const recommendedPayment = calculateRecommendedMonthlyPayment(targetAmount, savingsPeriod, product.annualRate);
      return {
        product,
        recommendedPayment,
      };
    })
    .filter(
      ({ product, recommendedPayment }) =>
        recommendedPayment >= product.minMonthlyAmount &&
        recommendedPayment <= product.maxMonthlyAmount &&
        product.availableTerms === savingsPeriod
    )
    .sort((a, b) => b.product.annualRate - a.product.annualRate); // 이자율 높은 순 정렬

  if (recommendedProducts.length === 0) {
    return (
      <>
        <Spacing size={16} />
        <ListRow
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="목표 금액과 저축 기간에 맞는 상품이 없어요. 다른 조건으로 검색해보세요."
            />
          }
        />
        <Spacing size={16} />
      </>
    );
  }

  const handleProductClick = (product: (typeof recommendedProducts)[0]['product'], recommendedPayment: number) => {
    setSelectedProduct(product);
    setMonthlyPayment(recommendedPayment);
    setCurrentTab('results');
  };

  return (
    <>
      <Spacing size={16} />
      <ListRow
        contents={
          <ListRow.Texts
            type="1RowTypeA"
            top={`목표 금액 달성을 위한 추천 상품 (${recommendedProducts.length}개)`}
            topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          />
        }
      />
      <Spacing size={16} />
      {recommendedProducts.map(({ product, recommendedPayment }) => (
        <div key={product.id}>
          <SavingProductItem
            product={product}
            isSelected={false}
            onClick={() => handleProductClick(product, recommendedPayment)}
            showCheckIcon={false}
          />
          <Spacing size={4} />
          <ListRow
            contents={
              <ListRow.Texts
                type="1RowTypeA"
                top={`추천 월 납입액: ${formatNumber(recommendedPayment)}원`}
                topProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              />
            }
          />
          <Spacing size={16} />
        </div>
      ))}
    </>
  );
};

export const RecommendedProducts = () => {
  return (
    <ErrorBoundary FallbackComponent={SavingProductErrorFallback}>
      <RecommendedProductsContent />
    </ErrorBoundary>
  );
};
