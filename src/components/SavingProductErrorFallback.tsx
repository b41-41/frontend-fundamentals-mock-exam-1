import { Button, ListRow, Spacing } from 'tosslib';

interface SavingProductErrorFallbackProps {
  resetErrorBoundary: () => void;
}

export const SavingProductErrorFallback = ({ resetErrorBoundary }: SavingProductErrorFallbackProps) => {
  return (
    <>
      <Spacing size={16} />
      <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품 정보를 불러오지 못했어요. 다시 시도해 보세요." />} />
      <Spacing size={16} />
      <Button onClick={resetErrorBoundary}>다시 시도</Button>
      <Spacing size={16} />
    </>
  );
};
