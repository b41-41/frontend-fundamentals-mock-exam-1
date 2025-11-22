import { ChangeEvent } from 'react';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { useSavingProductStore } from '@/store/useSavingProductStore';

const formatNumber = (value: number): string => {
  if (value === 0) {
    return '';
  }
  return value.toLocaleString('ko-KR');
};

const parseNumber = (value: string): number => {
  const parsed = parseInt(value.replace(/,/g, ''), 10);
  return isNaN(parsed) ? 0 : parsed;
};

export const SavingsCalculatorForm = () => {
  const { targetAmount, monthlyPayment, savingsPeriod, setTargetAmount, setMonthlyPayment, setSavingsPeriod } =
    useSavingProductStore();

  const handleTargetAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numValue = parseNumber(e.target.value);
    if (numValue < 0) {
      return;
    }
    if (numValue > 1000000000) {
      return;
    }
    setTargetAmount(numValue);
  };

  const handleMonthlyPaymentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numValue = parseNumber(e.target.value);
    if (numValue < 0) {
      return;
    }
    if (numValue > 100000000) {
      return;
    }
    setMonthlyPayment(numValue);
  };

  const handleSavingsPeriodChange = (value: number) => {
    setSavingsPeriod(value);
  };

  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formatNumber(targetAmount)}
        onChange={handleTargetAmountChange}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={formatNumber(monthlyPayment)}
        onChange={handleMonthlyPaymentChange}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsPeriod}
        onChange={handleSavingsPeriodChange}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={18}>18개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
};
