import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { noticeService } from '@/services/noticeService'

export const useGetNoticeDetail = (noticeId: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEY.NOTICE_DETAIL, noticeId],
    queryFn: () => noticeService.getNoticeDetail(noticeId),
    enabled: noticeId !== undefined,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  return {
    data,
    isError,
    isLoading,
  }
}
