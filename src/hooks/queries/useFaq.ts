import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { faqService } from '@/services/supportService'

export const useReadFaqType = () => {
  return useQuery({
    queryKey: [QUERY_KEY.FAQ_TYPES],
    queryFn: () => faqService.readeFaqTypes(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    placeholderData: previousData => previousData,
  })
}
