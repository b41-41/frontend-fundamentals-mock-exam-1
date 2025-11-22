import { colors, ListRow, Spacing } from 'tosslib';
import { useSavingProductStore } from '@/store/useSavingProductStore';
import { calculateExpectedProfit, calculateTotalAmount, calculateDifferenceFromTarget } from './calculations';

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

  if (monthlyPayment === 0 || savingsPeriod === 0) {
    return (
      <>
        <Spacing size={16} />
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="월 납입액과 저축 기간을 입력해주세요." />} />
        <Spacing size={16} />
      </>
    );
  }

  const totalDeposit = monthlyPayment * savingsPeriod;
  const expectedProfit = calculateExpectedProfit(monthlyPayment, savingsPeriod, selectedProduct.annualRate);
  const totalAmount = calculateTotalAmount(monthlyPayment, savingsPeriod, selectedProduct.annualRate);
  const difference = calculateDifferenceFromTarget(targetAmount, totalAmount);

  return (
    <>
      <Spacing size={16} />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="선택한 상품"
            topProps={{ fontSize: 14, color: colors.grey700 }}
            bottom={selectedProduct.name}
            bottomProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          />
        }
      />
      <Spacing size={8} />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="총 납입액"
            topProps={{ fontSize: 14, color: colors.grey700 }}
            bottom={`${formatNumber(totalDeposit)}원`}
            bottomProps={{ fontSize: 16, fontWeight: 'medium', color: colors.grey900 }}
          />
        }
      />
      <Spacing size={8} />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익"
            topProps={{ fontSize: 14, color: colors.grey700 }}
            bottom={`${formatNumber(expectedProfit)}원`}
            bottomProps={{ fontSize: 16, fontWeight: 'medium', color: colors.blue600 }}
          />
        }
      />
      <Spacing size={8} />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="총 수령액"
            topProps={{ fontSize: 14, color: colors.grey700 }}
            bottom={`${formatNumber(totalAmount)}원`}
            bottomProps={{ fontSize: 18, fontWeight: 'bold', color: colors.grey900 }}
          />
        }
      />
      {targetAmount > 0 && (
        <>
          <Spacing size={8} />
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="목표 금액과의 차이"
                topProps={{ fontSize: 14, color: colors.grey700 }}
                bottom={
                  difference >= 0
                    ? `목표 금액보다 ${formatNumber(difference)}원 많아요`
                    : `목표 금액보다 ${formatNumber(Math.abs(difference))}원 부족해요`
                }
                bottomProps={{
                  fontSize: 16,
                  fontWeight: 'medium',
                  color: difference >= 0 ? colors.blue600 : colors.red600,
                }}
              />
            }
          />
        </>
      )}
      <Spacing size={16} />
    </>
  );
};
