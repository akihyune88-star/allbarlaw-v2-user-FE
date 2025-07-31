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
} from '@/types/baroTalkTypes'
import { QUERY_KEY } from '@/constants/queryKey'

interface UseCreateBaroTalkOptions {
  onSuccess?: (_data?: any) => void
  onError?: (_error: Error) => void
}

export const useCreateBaroTalk = (options?: UseCreateBaroTalkOptions) => {
  const { getUserIdFromToken } = useAuth()
  const userId = getUserIdFromToken()

  return useMutation({
    mutationFn: (request: CreateBaroTalkRequest) => baroTalkServices.createBaroTalk(userId!, request),
    onSuccess: () => {
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
    staleTime: 0,
    gcTime: 0,
  })
}

export const useGetBaroTalkChatList = (request: BaroTalkChatListRequest) => {
  const { getUserIdFromToken } = useAuth()
  const userId = getUserIdFromToken()

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

export const useGetLawyerChatList = (lawyerId: number, request: { take: number; sort: string; page?: number }) => {
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
