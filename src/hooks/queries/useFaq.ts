import { QUERY_KEY } from '@/constants/queryKey'
import { faqService } from '@/services/supportService'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useReadFaqType = () => {
  const { data: faqTypes, ...rest } = useQuery({
    queryKey: [QUERY_KEY.FAQ_TYPES],
    queryFn: () => faqService.readeFaqTypes(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    placeholderData: previousData => previousData,
  })

  const faqTypeLookup = useMemo(() => {
    if (!faqTypes) return {}

    const dataArray = Array.isArray(faqTypes) ? faqTypes : faqTypes.data
    if (!dataArray || !Array.isArray(dataArray)) return {}

    return dataArray.reduce((acc: Record<number, string>, type: any) => {
      acc[type.faqTypeId] = type.faqTypeName
      return acc
    }, {} as Record<number, string>)
  }, [faqTypes])

  const getFaqTypeName = (faqTypeId: number) => {
    return faqTypeLookup[faqTypeId] || '전체'
  }

  return {
    data: faqTypes,
    faqTypeLookup,
    getFaqTypeName,
    ...rest,
  }
}

export const useReadFaqList = (faqTypeId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.FAQ_LIST, faqTypeId],
    queryFn: () => faqService.readFaqList(faqTypeId),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    placeholderData: previousData => previousData,
  })
}

export const useInfiniteFaqList = (request: {
  take: number
  cursor?: number
  cursorId?: number
  faqTypeId?: 'all' | number
}) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEY.FAQ_LIST, 'infinite', request.cursor, request.cursorId, request.faqTypeId],
    queryFn: ({ pageParam }) =>
      faqService.getFaqList({
        ...request,
        cursor: pageParam?.cursor,
        cursorId: pageParam?.cursorId,
        faqTypeId: request.faqTypeId,
      }),
    initialPageParam: undefined as { cursor?: number; cursorId?: number } | undefined,
    getNextPageParam: lastPage => {
      if (!lastPage.hasNextPage) return undefined
      return {
        cursor: lastPage.nextCursor,
        cursorId: lastPage.nextCursorId,
      }
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  // 모든 페이지의 데이터를 하나의 배열로 합치기
  const faqList = data?.pages.flatMap(page => page.data as any[]) ?? []

  return {
    faqList,
    isLoading,
    isError,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
  }
}
