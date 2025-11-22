import { Assets, colors, ListRow } from 'tosslib';
import type { SavingsProduct } from '@/types/savingProduct';

interface SavingProductItemProps {
  product: SavingsProduct;
  isSelected: boolean;
  onClick: () => void;
  showCheckIcon?: boolean;
}

const formatAmount = (amount: number): string => {
  return amount.toLocaleString('ko-KR');
};

export const SavingProductItem = ({ product, isSelected, onClick, showCheckIcon = true }: SavingProductItemProps) => {
  const { name, annualRate, minMonthlyAmount, maxMonthlyAmount, availableTerms } = product;

  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${formatAmount(minMonthlyAmount)}원 ~ ${formatAmount(maxMonthlyAmount)}원 | ${availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isSelected && showCheckIcon ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
      onClick={onClick}
    />
  );
};
