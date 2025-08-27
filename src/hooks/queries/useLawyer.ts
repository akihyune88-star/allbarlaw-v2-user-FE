import { useQuery, useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { lawyerService } from '@/services/lawyerService'
import {
  LawyerActiveRequest,
  LawyerKeepResponse,
  LawyerListRequest,
  LawyerSignUpRequest,
  RandomLawyerListRequest,
  LawyerCareer,
} from '@/types/lawyerTypes'

export const useLawyerList = (request: LawyerListRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_LIST, ...Object.values(request)],
    queryFn: () => lawyerService.getLawyerList(request),
    enabled: request.subcategoryId !== undefined,
  })
}

export const useInfiniteLawyerList = (request: Omit<LawyerListRequest, 'cursor' | 'cursorId'>) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.LAWYER_LIST, 'infinite', request.subcategoryId, request.orderBy],
    queryFn: ({ pageParam }) => {
      return lawyerService.getLawyerList({
        ...request,
        cursor: pageParam?.cursor,
        cursorId: pageParam?.cursorId,
      })
    },
    enabled: request.subcategoryId !== undefined,
    initialPageParam: undefined as undefined | { cursor: number; cursorId: number },
    getNextPageParam: lastPage => {
      if (!lastPage.hasNextPage) return undefined
      return {
        cursor: lastPage.nextCursor,
        cursorId: lastPage.nextCursorId,
      }
    },
    select: data => {
      const lawyerList = data.pages.flatMap(page => {
        // 서버 응답이 정상적인 경우
        if (Array.isArray(page?.data)) {
          return page.data.filter(Boolean) // null/undefined 제거
        }
        // 비정상 응답인 경우 빈 배열 반환
        return []
      })

      return {
        pages: data.pages,
        pageParams: data.pageParams,
        lawyerList,
      }
    },
  })
}

export const useRandomLawyerList = (request: RandomLawyerListRequest) => {
  const { data, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: [QUERY_KEY.LAWYER_LIST, 'random', request.subcategoryId, request.take, request.excludeIds],
    queryFn: () => lawyerService.getRandomLawyerList(request),
    placeholderData: previousData => previousData, // 이전 데이터 유지로 깜빡임 방지
  })

  return {
    lawyerList: data?.data || [],
    isLoading,
    isPlaceholderData,
    hasNextPage: data?.hasNextPage ?? true,
    refetch,
  }
}

export const useLawyerDetail = (lawyerId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_DETAIL, lawyerId],
    queryFn: () => lawyerService.getLawyerDetail(lawyerId),
    enabled: options?.enabled !== false,
  })
}

// useLawyer는 useLawyerDetail의 별칭
export const useLawyer = useLawyerDetail

export const useLawyerDetailForMe = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_DETAIL, 'me'],
    queryFn: () => lawyerService.getLawyerDetailForMe(),
    enabled: options?.enabled !== false,
  })
}

// 복수의 변호사 정보를 조회하는 훅
export const useLawyers = (lawyerIds: number[]) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_DETAIL, 'multiple', lawyerIds],
    queryFn: async () => {
      if (!lawyerIds || lawyerIds.length === 0) return []

      const promises = lawyerIds.map(id => lawyerService.getLawyerDetail(id))
      const results = await Promise.allSettled(promises)

      return results
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value)
    },
    enabled: lawyerIds && lawyerIds.length > 0,
  })
}

export const useLawyerKeep = ({
  onSuccess,
  onError,
}: {
  onSuccess: (_data: LawyerKeepResponse) => void
  onError: () => void
}) => {
  return useMutation({
    mutationFn: (lawyerId: number) => lawyerService.changeLawyerKeep(lawyerId),
    onSuccess: (data: LawyerKeepResponse, _lawyerId: number) => {
      onSuccess(data)
    },
    onError: () => {
      onError()
    },
  })
}

export const useLawyerActive = (request: LawyerActiveRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_ACTIVE, request.page, request.take, request.days],
    queryFn: () => lawyerService.getLawyerActive(request),
    select: data => data.data,
  })
}

export const useLawyerSignUp = ({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) => {
  return useMutation({
    mutationFn: (request: LawyerSignUpRequest) => lawyerService.signUpLawyer(request),
    onSuccess: () => {
      onSuccess()
    },
    onError: () => {
      onError()
    },
  })
}

// 변호사 경력 조회 훅
export const useLawyerCareer = (lawyerId?: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_DETAIL, 'career', lawyerId],
    queryFn: () => lawyerService.getLawyerCareer(lawyerId!),
    enabled: !!lawyerId,
  })
}

// 변호사 경력 업데이트 훅
export const useUpdateLawyerCareer = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: (error: any) => void
}) => {
  return useMutation({
    mutationFn: (careerData: LawyerCareer[]) => lawyerService.updateLawyerCareer(careerData),
    onSuccess: () => {
      onSuccess?.()
    },
    onError: error => {
      onError?.(error)
    },
  })
}
