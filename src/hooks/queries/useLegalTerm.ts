import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { legalTermService } from '@/services/legalTermService'
import { QUERY_KEY } from '@/constants/queryKey'
import { LegalTermListRequest } from '@/types/legalTermTypes'

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

export const useInfiniteLegalTermList = (request: Omit<LegalTermListRequest, 'legalTermPage'>) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.LEGAL_TERM_LIST, 'infinite', request.orderBy, request.sort, request.search],
    queryFn: ({ pageParam = 1 }) => {
      console.log('🔍 Fetching legal terms - page:', pageParam, 'request:', request)
      return legalTermService.getLegalTermList({
        ...request,
        legalTermPage: pageParam,
      })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      console.log('📄 getNextPageParam:', {
        hasNextPage: lastPage.hasNextPage,
        currentPages: allPages.length,
        lastPageData: lastPage.data?.length,
        nextPage: lastPage.hasNextPage ? allPages.length + 1 : undefined,
      })
      if (!lastPage.hasNextPage) return undefined
      return allPages.length + 1
    },
    select: data => {
      const result = {
        pages: data.pages,
        pageParams: data.pageParams,
        legalTermList: data.pages.flatMap(page => page.data),
      }
      console.log('📊 Selected data:', {
        totalItems: result.legalTermList.length,
        pageCount: data.pages.length,
      })
      return result
    },
  })
}
