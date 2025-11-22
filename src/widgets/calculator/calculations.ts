/**
 * 예상 수익 금액 계산 (최종 금액)
 * 공식: 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)
 */
export const calculateExpectedProfit = (monthlyPayment: number, savingsPeriod: number, annualRate: number): number => {
  if (monthlyPayment <= 0 || savingsPeriod <= 0 || annualRate <= 0) {
    return 0;
  }

  const rate = annualRate / 100;
  const finalAmount = monthlyPayment * savingsPeriod * (1 + rate * 0.5);

  return Math.round(finalAmount);
};

/**
 * 총 수령액 계산
 * 총 수령액 = 총 납입액 + 예상 수익
 */
export const calculateTotalAmount = (monthlyPayment: number, savingsPeriod: number, annualRate: number): number => {
  const totalDeposit = monthlyPayment * savingsPeriod;
  const profit = calculateExpectedProfit(monthlyPayment, savingsPeriod, annualRate);

  return totalDeposit + profit;
};

/**
 * 목표 금액과의 차이 계산
 * 공식: 목표 금액 - 예상 수익 금액
 * 양수: 목표 금액 미달, 음수: 목표 금액 초과
 */
export const calculateDifferenceFromTarget = (targetAmount: number, totalAmount: number): number => {
  return targetAmount - totalAmount;
};

/**
 * 추천 월 납입 금액 계산
 * 공식: 월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))
 * 1,000원 단위로 반올림
 */
export const calculateRecommendedMonthlyPayment = (
  targetAmount: number,
  savingsPeriod: number,
  annualRate: number
): number => {
  if (targetAmount <= 0 || savingsPeriod <= 0 || annualRate <= 0) {
    return 0;
  }

  const rate = annualRate / 100;
  const recommendedPayment = targetAmount / (savingsPeriod * (1 + rate * 0.5));

  // 1,000원 단위로 반올림
  return Math.round(recommendedPayment / 1000) * 1000;
};
