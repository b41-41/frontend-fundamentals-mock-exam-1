import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { SavingProductErrorFallback } from '@/components/SavingProductErrorFallback';
import { useSavingsProducts } from '@/hooks/useSavingsProducts';
import { useSavingProductStore } from '@/store/useSavingProductStore';
import { calculateRecommendedMonthlyPayment } from '@/widgets/calculator/calculations';
import { filterProductsForRecommendation } from '@/features/SavingProduct/helpers/filters';

const formatNumber = (value: number): string => {
  return value.toLocaleString('ko-KR');
};

const RecommendedProductsContent = () => {
  const { data: products } = useSavingsProducts();
  const { targetAmount, savingsPeriod, selectedProduct, monthlyPayment } = useSavingProductStore();

  if (!selectedProduct) {
    return null;
  }

  if (products.length === 0) {
    return (
      <>
        <Spacing size={16} />
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="현재 등록된 적금 상품이 없어요." />} />
        <Spacing size={16} />
      </>
    );
  }

  const filteredProducts = filterProductsForRecommendation(products, monthlyPayment, savingsPeriod);

  const recommendedProducts = filteredProducts
    .map(product => {
      const recommendedPayment = calculateRecommendedMonthlyPayment(targetAmount, savingsPeriod, product.annualRate);
      return {
        product,
        recommendedPayment,
      };
    })
    .sort((a, b) => b.product.annualRate - a.product.annualRate);

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

  return (
    <>
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />
      {recommendedProducts.slice(0, 2).map(({ product }) => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${formatNumber(product.minMonthlyAmount)}원 ~ ${formatNumber(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          onClick={() => {}}
        />
      ))}
      <Spacing size={40} />
    </>
  );
};

export const RecommendedProducts = () => {
  return (
    <ErrorBoundary FallbackComponent={SavingProductErrorFallback}>
      <Suspense
        fallback={
          <>
            <Spacing size={16} />
            <div>추천 상품을 찾고 있어요...</div>
            <Spacing size={16} />
          </>
        }
      >
        <RecommendedProductsContent />
      </Suspense>
    </ErrorBoundary>
  );
};
