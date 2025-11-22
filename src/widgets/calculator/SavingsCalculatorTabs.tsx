import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tab } from 'tosslib';
import { useSavingProductStore } from '@/store/useSavingProductStore';

export const SavingsCalculatorTabs = () => {
  const { currentTab, setCurrentTab } = useSavingProductStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL에서 탭 상태 복원
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl === 'products' || tabFromUrl === 'results') {
      setCurrentTab(tabFromUrl);
    }
  }, [searchParams, setCurrentTab]);

  const handleTabChange = (value: string) => {
    if (value === 'products' || value === 'results') {
      setCurrentTab(value);
      setSearchParams({ tab: value });
    }
  };

  return (
    <Tab onChange={handleTabChange}>
      <Tab.Item value="products" selected={currentTab === 'products'}>
        적금 상품
      </Tab.Item>
      <Tab.Item value="results" selected={currentTab === 'results'}>
        계산 결과
      </Tab.Item>
    </Tab>
  );
};
