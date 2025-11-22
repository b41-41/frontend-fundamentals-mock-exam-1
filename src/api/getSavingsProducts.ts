import { http, isHttpError } from 'tosslib';
import type { SavingsProduct } from '@/types/savingProduct';

export const getSavingsProducts = async (): Promise<SavingsProduct[]> => {
  try {
    const response = await http.get<SavingsProduct[]>('/api/savings-products');
    return response;
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(`상품 정보를 불러오는데 실패했어요: ${error.message}`);
    }
    throw new Error('상품 정보를 불러오는데 실패했어요.');
  }
};
