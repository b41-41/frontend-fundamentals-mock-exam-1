import { colors, ListRow, Spacing } from 'tosslib';
import { useSavingProductStore } from '@/store/useSavingProductStore';
import {
  calculateExpectedProfit,
  calculateDifferenceFromTarget,
  calculateRecommendedMonthlyPayment,
} from './calculations';

const formatNumber = (value: number): string => {
  return value.toLocaleString('ko-KR');
};

export const CalculationResult = () => {
  const { targetAmount, monthlyPayment, savingsPeriod, selectedProduct } = useSavingProductStore();

  if (!selectedProduct) {
    return (
      <>
        <Spacing size={16} />
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
        <Spacing size={16} />
      </>
    );
  }

  const finalAmount = calculateExpectedProfit(monthlyPayment, savingsPeriod, selectedProduct.annualRate);
  const difference = calculateDifferenceFromTarget(targetAmount, finalAmount);
  const recommendedPayment = calculateRecommendedMonthlyPayment(
    targetAmount,
    savingsPeriod,
    selectedProduct.annualRate
  );

  return (
    <>
      <Spacing size={8} />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatNumber(finalAmount)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={`${difference >= 0 ? '' : '-'}${formatNumber(Math.abs(difference))}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatNumber(recommendedPayment)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <Spacing size={8} />
    </>
  );
};
