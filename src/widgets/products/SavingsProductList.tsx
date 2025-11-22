import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Spacing } from 'tosslib';
import { SavingProductErrorFallback } from '@/components/SavingProductErrorFallback';
import { SavingProductItem } from '@/features/SavingProduct/SavingProductItem';
import { useSavingsProducts } from '@/hooks/useSavingsProducts';
import { useSavingProductStore } from '@/store/useSavingProductStore';
import { filterProductsForRecommendation } from '@/features/SavingProduct/helpers/filters';

const SavingsProductListContent = () => {
  const { data: products } = useSavingsProducts();
  const { selectedProduct, setSelectedProduct, setCurrentTab, monthlyPayment, savingsPeriod } = useSavingProductStore();

  if (products.length === 0) {
    return (
      <>
        <Spacing size={16} />
        <div>현재 등록된 적금 상품이 없어요.</div>
        <Spacing size={16} />
      </>
    );
  }

  const filteredProducts = filterProductsForRecommendation(products, monthlyPayment, savingsPeriod);

  if (filteredProducts.length === 0) {
    return (
      <>
        <Spacing size={16} />
        <div>조건에 맞는 상품이 없어요. 다른 조건으로 검색해보세요.</div>
        <Spacing size={16} />
      </>
    );
  }

  return (
    <>
      <Spacing size={16} />
      {filteredProducts.map(product => (
        <SavingProductItem
          key={product.id}
          product={product}
          isSelected={selectedProduct?.id === product.id}
          onClick={() => {
            setSelectedProduct(product);
            setCurrentTab('results');
          }}
        />
      ))}
      <Spacing size={16} />
    </>
  );
};

export const SavingsProductList = () => {
  return (
    <ErrorBoundary FallbackComponent={SavingProductErrorFallback}>
      <Suspense
        fallback={
          <>
            <Spacing size={16} />
            <div>상품 정보를 불러오고 있어요...</div>
            <Spacing size={16} />
          </>
        }
      >
        <SavingsProductListContent />
      </Suspense>
    </ErrorBoundary>
  );
};
