import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { SearchRequest, SearchResponse } from '@/types/searchTypes'
import { searchService } from '@/services/searchService'

// Basic search query hook
export const useSearchList = (request: SearchRequest) => {
  return useQuery({
    queryKey: [
      QUERY_KEY.SEARCH,
      request.searchQuery,
      request.searchTab,
      request.searchPage,
      request.searchSize,
      request.searchSortBy,
      request.searchLawyerId,
    ],
    queryFn: () => searchService.getSearchBlog(request),
    placeholderData: previousData => previousData,
  })
}

// Infinite scroll search query hook
export const useInfiniteSearchList = (request: Omit<SearchRequest, 'searchPage'>) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [
      QUERY_KEY.SEARCH,
      'infinite',
      request.searchQuery,
      request.searchTab,
      request.searchSize,
      request.searchSortBy,
      request.searchLawyerId,
    ],
    queryFn: ({ pageParam = 1 }) => {
      return searchService.getSearchBlog({
        ...request,
        searchPage: pageParam,
      })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: SearchResponse) => {
      if (!lastPage.hasNextPage) return undefined
      return lastPage.currentPage + 1
    },
    placeholderData: previousData => previousData,
  })

  // Combine all pages' search results into one
  const allSearchResults = data?.pages.reduce(
    (acc, page) => ({
      searchBlogResults: [...acc.searchBlogResults, ...(page?.searchResults?.searchBlogResults || [])],
      searchVideoResults: [...acc.searchVideoResults, ...(page?.searchResults?.searchVideoResults || [])],
      searchConsultationResults: [
        ...acc.searchConsultationResults,
        ...(page?.searchResults?.searchConsultationResults || []),
      ],
      searchLawyerResults: [...acc.searchLawyerResults, ...(page?.searchResults?.searchLawyerResults || [])],
    }),
    {
      searchBlogResults: [],
      searchVideoResults: [],
      searchConsultationResults: [],
      searchLawyerResults: [],
    } as SearchResponse['searchResults']
  )

  // Total counts from the first page
  const searchTotalCounts = data?.pages[0]?.searchTotalCounts

  return {
    searchResults: allSearchResults,
    searchTotalCounts,
    totalItems: data?.pages[0]?.totalItems ?? 0,
    isLoading,
    isError,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
  }
}
