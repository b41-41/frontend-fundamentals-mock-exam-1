/**
 * 예상 수익 금액 계산
 * 정기적금 이자 계산 (단리)
 * 공식: 월 납입액 × (연이자율/12) × n(n+1)/2
 */
export const calculateExpectedProfit = (monthlyPayment: number, savingsPeriod: number, annualRate: number): number => {
  if (monthlyPayment <= 0 || savingsPeriod <= 0 || annualRate <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 100 / 12;
  const profit = (monthlyPayment * monthlyRate * (savingsPeriod * (savingsPeriod + 1))) / 2;

  return Math.round(profit);
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
 * 양수: 목표 금액 초과, 음수: 목표 금액 미달
 */
export const calculateDifferenceFromTarget = (targetAmount: number, totalAmount: number): number => {
  return totalAmount - targetAmount;
};

/**
 * 추천 월 납입 금액 계산
 * 목표 금액을 달성하기 위한 월 납입액 역산
 * 공식을 역산하여 계산 (이분 탐색 또는 근사값)
 */
export const calculateRecommendedMonthlyPayment = (
  targetAmount: number,
  savingsPeriod: number,
  annualRate: number
): number => {
  if (targetAmount <= 0 || savingsPeriod <= 0 || annualRate <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 100 / 12;
  const coefficient = savingsPeriod + (monthlyRate * (savingsPeriod * (savingsPeriod + 1))) / 2;

  const recommendedPayment = targetAmount / coefficient;

  return Math.round(recommendedPayment);
};
