import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { legalTermService } from '@/services/legalTermService'
import { QUERY_KEY } from '@/constants/queryKey'
import { LegalTermListRequest, LegalTermReportRequest } from '@/types/legalTermTypes'

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

export const useInfiniteLegalTermList = (
  request: Omit<LegalTermListRequest, 'legalTermPage'>,
  options?: { enabled?: boolean }
) => {
  return useInfiniteQuery({
    queryKey: [
      QUERY_KEY.LEGAL_TERM_LIST,
      'infinite',
      request.orderBy,
      request.sort,
      request.search || 'all',
      request.consonant || 'all',
    ],
    queryFn: ({ pageParam = 1 }) =>
      legalTermService.getLegalTermList({
        ...request,
        legalTermPage: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasNextPage) return undefined
      return allPages.length + 1
    },
    select: data => ({
      pages: data.pages,
      pageParams: data.pageParams,
      legalTermList: data.pages.flatMap(page => page.data),
    }),
    enabled: options?.enabled !== undefined ? options.enabled : true,
  })
}

export const useInfiniteSearchLegalTermList = (search: string, options?: { enabled?: boolean }) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.LEGAL_TERM_LIST, 'infinite', 'search', search],
    queryFn: ({ pageParam: _pageParam = 1 }) => legalTermService.getSearchLegalTermItem(search),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasNextPage) return undefined
      return allPages.length + 1
    },
    select: data => ({
      pages: data.pages,
      pageParams: data.pageParams,
      legalTermList: data.pages.flatMap(page => page.data),
    }),
    enabled: options?.enabled !== undefined ? options.enabled : true,
  })
}

export const useDeleteRecentSearch = (options?: { onSuccess?: () => void; onError?: () => void }) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (searchQuery: string) => legalTermService.deleteRecentSearch(searchQuery),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.RECENT_SEARCHES] })
      options?.onSuccess?.()
    },
    onError: () => {
      options?.onError?.()
    },
  })
}

export const useLegalTermDetail = (legalTermId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.LEGAL_TERM_DETAIL, legalTermId],
    queryFn: () => legalTermService.getLegalTermDetail(legalTermId),
    select: data => data,
  })
}

export const useReportLegalTerm = (options?: { onSuccess?: () => void; onError?: () => void }) => {
  return useMutation({
    mutationFn: ({ legalTermId, request }: { legalTermId: number; request: LegalTermReportRequest }) =>
      legalTermService.reportLegalTerm(legalTermId, request),
    onSuccess: () => {
      options?.onSuccess?.()
    },
    onError: () => {
      options?.onError?.()
    },
  })
}
