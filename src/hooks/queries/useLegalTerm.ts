import { useQuery } from '@tanstack/react-query'
import { legalTermService } from '@/services/legalTermService'
import { QUERY_KEY } from '@/constants/queryKey'

export const usePopularLegalTermList = () => {
  return useQuery({
    queryKey: [QUERY_KEY.POPULAR_LEGAL_TERM_LIST],
    queryFn: legalTermService.getPopularLegalTermList,
    select: data => data.data,
  })
}

export const useRecentSearches = () => {
  return useQuery({
    queryKey: [QUERY_KEY.RECENT_SEARCHES],
    queryFn: legalTermService.getRecentSearches,
    select: data => data.data,
  })
}

export const useRecentRegisteredLegalTermList = () => {
  return useQuery({
    queryKey: [QUERY_KEY.RECENT_REGISTERED_LEGAL_TERM_LIST],
    queryFn: legalTermService.getRecentRegisteredLegalTermList,
    select: data => data.data,
  })
}
