import { useQuery } from '@tanstack/react-query'
import { categoryService } from '@/services/categoryService'
import { QUERY_KEY } from '@/constants/queryKey'

// 카테고리 데이터를 가져오는 커스텀 훅
export const useCategory = () => {
  return useQuery({
    queryKey: [QUERY_KEY.CATEGORY],
    queryFn: categoryService.getCategories,
    // 추가 옵션들
    staleTime: 1000 * 60 * 10, // 10분간 fresh 상태 유지
    gcTime: 1000 * 60 * 30, // 30분간 캐시 보관
  })
}
