import { Border, NavigationBar, Spacing } from 'tosslib';
import { useSavingProductStore } from '@/store/useSavingProductStore';
import { CalculationResult } from '@/widgets/calculator/CalculationResult';
import { RecommendedProducts } from '@/widgets/calculator/RecommendedProducts';
import { SavingsCalculatorForm } from '@/widgets/calculator/SavingsCalculatorForm';
import { SavingsCalculatorTabs } from '@/widgets/calculator/SavingsCalculatorTabs';
import { SavingsProductList } from '@/widgets/calculator/SavingsProductList';

export function SavingsCalculatorPage() {
  const { currentTab } = useSavingProductStore();

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <SavingsCalculatorForm />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <SavingsCalculatorTabs />

      {currentTab === 'products' && <SavingsProductList />}

      {currentTab === 'results' && (
        <>
          <CalculationResult />
          <Border height={16} />
          <Spacing size={8} />
          <RecommendedProducts />
        </>
      )}

      <Spacing size={40} />
    </>
  );
}
