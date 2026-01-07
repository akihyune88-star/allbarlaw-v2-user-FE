import { useMutation, useInfiniteQuery, useQueryClient, useQuery } from '@tanstack/react-query'
import { baroTalkServices } from '@/services/baroTalkServices'
import { useAuth } from '@/contexts/AuthContext'
import {
  CreateBaroTalkRequest,
  BaroTalkLawyerListRequest,
  BaroTalkChatListRequest,
  UpdateChatRoomStatusRequest,
  UpdateChatRoomStatusResponse,
  LeaveChatRoomRequest,
  PatchMessageRequest,
  PatchMessageResponse,
  ChatRoomStatus,
  ChangeConsultationContentRequest,
} from '@/types/baroTalkTypes'
import { QUERY_KEY } from '@/constants/queryKey'
import { isAxiosError } from 'axios'
import { getErrorMessage } from '@/utils/errorHandler'

interface UseCreateBaroTalkOptions {
  onSuccess?: (_data?: any) => void
  onError?: (_error: Error) => void
}

export const useCreateBaroTalk = (options?: UseCreateBaroTalkOptions) => {
  const { getUserIdFromToken } = useAuth()
  const userId = getUserIdFromToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateBaroTalkRequest) => baroTalkServices.createBaroTalk(userId!, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BARO_TALK_CHAT_LIST] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MY_CONSULTATION_LIST] })
      options?.onSuccess?.()
    },
    onError: (error: Error) => {
      options?.onError?.(error)
    },
  })
}

export const useGetBaroTalkLawyerList = (request: BaroTalkLawyerListRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.BARO_TALK_LAWYER_LIST, request.subcategoryId, request.tags], // excludeLawyerIds 제거
    queryFn: () =>
      baroTalkServices.getBaroTalkLawyerList({
        ...request,
        take: 6,
      }),
    select: data => data.lawyers,
  })
}

export const useGetBaroTalkChatList = (request: BaroTalkChatListRequest, options?: { enabled?: boolean }) => {
  const { getUserIdFromToken } = useAuth()
  const userId = getUserIdFromToken()

  // enabled 옵션이 명시적으로 전달되지 않으면 true (기존 동작 유지)
  const shouldEnable = options?.enabled !== undefined ? options.enabled : true

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.BARO_TALK_CHAT_LIST, request],
    queryFn: ({ pageParam = 1 }) =>
      baroTalkServices.getBaroTalkChatList(userId!, {
        ...request,
        chatRoomPage: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      // 현재 페이지가 전체 페이지보다 작으면 다음 페이지가 있음
      if (lastPage.page < lastPage.totalPages) {
        return allPages.length + 1
      }
      return undefined
    },
    initialPageParam: 1,
    enabled: !!userId && shouldEnable, // userId가 있고 enabled가 true일 때만 쿼리 실행
    staleTime: 0, // 즉시 stale로 처리
    gcTime: 0, // 가비지 컬렉션 즉시 실행
    refetchOnMount: true, // 컴포넌트 마운트 시 항상 refetch
    refetchOnWindowFocus: true, // 윈도우 포커스 시 refetch
  })
}

export const useUpdateChatRoomStatus = (options?: UseCreateBaroTalkOptions) => {
  const { getUserIdFromToken } = useAuth()
  const userId = getUserIdFromToken()

  return useMutation<UpdateChatRoomStatusResponse, Error, UpdateChatRoomStatusRequest>({
    mutationFn: ({ chatRoomId, status }: UpdateChatRoomStatusRequest) =>
      baroTalkServices.updateChatRoomStatus(userId!, { chatRoomId, status }),
    onSuccess: data => {
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      options?.onError?.(error)
    },
  })
}

export const useGetLawyerChatList = (
  lawyerId: number,
  request: { take: number; sort: string; page?: number },
  refetchInterval?: number
) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.LAWYER_CHAT_LIST, lawyerId, request],
    queryFn: ({ pageParam = 1 }) =>
      baroTalkServices.getLawyerChatList(lawyerId, {
        ...request,
        page: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasNextPage) {
        return allPages.length + 1
      }
      return undefined
    },
    initialPageParam: 1,
    staleTime: 0, // 즉시 stale로 처리
    gcTime: 0, // 가비지 컬렉션 즉시 실행
    refetchOnMount: true, // 컴포넌트 마운트 시 항상 refetch
    refetchOnWindowFocus: true, // 윈도우 포커스 시 refetch
    refetchInterval, // 폴링 간격 (밀리초)
  })
}

export const useLeaveChatRoom = (options?: UseCreateBaroTalkOptions) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: LeaveChatRoomRequest) => baroTalkServices.leaveChatRoom(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BARO_TALK_CHAT_LIST] })
      options?.onSuccess?.()
    },
    onError: (error: Error) => {
      options?.onError?.(error)
    },
  })
}

export const usePatchMessage = ({
  onSuccess,
  onError,
}: {
  onSuccess: (_data: PatchMessageResponse) => void
  onError: (_error: string) => void
}) => {
  return useMutation({
    mutationFn: (request: PatchMessageRequest) => baroTalkServices.patchMessage(request),
    onSuccess: data => {
      onSuccess?.(data)
    },
    onError: (error: Error) => {
      if (isAxiosError(error)) {
        const errorMessage = getErrorMessage(error.response?.data.code)
        onError?.(errorMessage)
      }
    },
  })
}

export const useGetConsultationRequestItem = (consultationRequestId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.CONSULTATION_REQUEST_ITEM, consultationRequestId],
    queryFn: () => baroTalkServices.getConsultationRequestList(consultationRequestId),
  })
}

export const useChangeConsultationStatus = ({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      consultationRequestId,
      consultationRequestStatus,
    }: {
      consultationRequestId: number
      consultationRequestStatus: ChatRoomStatus
    }) => baroTalkServices.changeConsultationStatus(consultationRequestId, consultationRequestStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MY_CONSULTATION_LIST] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CONSULTATION_REQUEST_ITEM] })
      onSuccess()
    },
    onError: () => {
      onError()
    },
  })
}

export const useChangeConsultationHidden = ({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      consultationRequestId,
      consultationRequestIsHidden,
    }: {
      consultationRequestId: number
      consultationRequestIsHidden: boolean
    }) => baroTalkServices.changeConsultationHidden(consultationRequestId, consultationRequestIsHidden),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MY_CONSULTATION_LIST] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CONSULTATION_REQUEST_ITEM] })
      onSuccess()
    },
    onError: () => {
      onError()
    },
  })
}

export const useChangeConsultationContent = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void
  onError: () => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: ChangeConsultationContentRequest) => baroTalkServices.changeConsultationContent(request),
    onSuccess: () => {
      onSuccess()
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MY_CONSULTATION_LIST] })
    },
    onError: () => {
      onError()
    },
  })
}
