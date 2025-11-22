import type { SavingsProduct } from '@/types/savingProduct';

/**
 * 월 납입액 범위로 상품 필터링
 * 사용자의 월 납입액이 상품의 min/max 범위 내에 있는지 확인
 */
export const filterByMonthlyAmount = (products: SavingsProduct[], monthlyPayment: number): SavingsProduct[] => {
  if (monthlyPayment <= 0) {
    return products;
  }

  return products.filter(
    product => monthlyPayment >= product.minMonthlyAmount && monthlyPayment <= product.maxMonthlyAmount
  );
};

/**
 * 저축 기간으로 상품 필터링
 * 사용자의 저축 기간과 상품의 가능 기간이 일치하는지 확인
 */
export const filterByAvailableTerm = (products: SavingsProduct[], savingsPeriod: number): SavingsProduct[] => {
  if (savingsPeriod <= 0) {
    return products;
  }

  return products.filter(product => product.availableTerms === savingsPeriod);
};

/**
 * 추천 상품 필터링 (복합 필터)
 * 월 납입액 + 저축 기간 조건을 모두 만족하는 상품 필터링
 */
export const filterProductsForRecommendation = (
  products: SavingsProduct[],
  monthlyPayment: number,
  savingsPeriod: number
): SavingsProduct[] => {
  let filteredProducts = products;

  // 월 납입액 필터 적용
  filteredProducts = filterByMonthlyAmount(filteredProducts, monthlyPayment);

  // 저축 기간 필터 적용
  filteredProducts = filterByAvailableTerm(filteredProducts, savingsPeriod);

  return filteredProducts;
};
