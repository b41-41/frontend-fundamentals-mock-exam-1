import { ErrorBoundary } from 'react-error-boundary';
import { Spacing } from 'tosslib';
import { SavingProductErrorFallback } from '@/components/SavingProductErrorFallback';
import { SavingProductItem } from '@/features/SavingProduct/SavingProductItem';
import { useSavingsProducts } from '@/hooks/useSavingsProducts';
import { useSavingProductStore } from '@/store/useSavingProductStore';

const SavingsProductListContent = () => {
  const { data: products, isLoading, error } = useSavingsProducts();
  const { selectedProduct, setSelectedProduct } = useSavingProductStore();

  if (isLoading) {
    return (
      <>
        <Spacing size={16} />
        <div>상품 정보를 불러오고 있어요...</div>
        <Spacing size={16} />
      </>
    );
  }

  if (error) {
    throw error;
  }

  if (!products || products.length === 0) {
    return (
      <>
        <Spacing size={16} />
        <div>현재 등록된 적금 상품이 없어요.</div>
        <Spacing size={16} />
      </>
    );
  }

  return (
    <>
      <Spacing size={16} />
      {products.map(product => (
        <SavingProductItem
          key={product.id}
          product={product}
          isSelected={selectedProduct?.id === product.id}
          onClick={() => setSelectedProduct(product)}
        />
      ))}
      <Spacing size={16} />
    </>
  );
};

export const SavingsProductList = () => {
  return (
    <ErrorBoundary FallbackComponent={SavingProductErrorFallback}>
      <SavingsProductListContent />
    </ErrorBoundary>
  );
};
