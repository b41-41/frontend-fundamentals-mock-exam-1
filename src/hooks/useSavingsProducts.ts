import { useQuery } from '@tanstack/react-query';
import { getSavingsProducts } from '@/api/getSavingsProducts';
import { queryKeys } from '@/constants/queryKeys';

export const useSavingsProducts = () => {
  return useQuery({
    queryKey: queryKeys.savingsProducts,
    queryFn: getSavingsProducts,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
};
