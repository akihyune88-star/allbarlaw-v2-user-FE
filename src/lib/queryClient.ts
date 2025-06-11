import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 데이터가 5분간 fresh 상태로 유지
      staleTime: 1000 * 60 * 5,
      // 캐시된 데이터를 10분간 보관
      gcTime: 1000 * 60 * 10,
      // 에러 발생 시 재시도 횟수
      retry: 1,
      // 창이 포커스될 때 자동으로 refetch 하지 않음
      refetchOnWindowFocus: false,
    },
    mutations: {
      // 뮤테이션 에러 발생 시 재시도 하지 않음
      retry: false,
    },
  },
})
