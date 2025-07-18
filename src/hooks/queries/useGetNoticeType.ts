import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { noticeService } from '@/services/supportService'

export const useGetNoticeType = () => {
  return useQuery({
    queryKey: [QUERY_KEY.NOTICE_TYPES],
    queryFn: noticeService.getNoticeTypes,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    placeholderData: previousData => previousData,
  })
}
