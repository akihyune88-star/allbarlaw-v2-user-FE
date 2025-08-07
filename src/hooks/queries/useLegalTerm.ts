import { useQuery } from '@tanstack/react-query'
import { legalTermService } from '@/services/legalTermService'

export const usePopularLegalTermList = () => {
  return useQuery({
    queryKey: ['popularLegalTermList'],
    queryFn: legalTermService.getPopularLegalTermList,
    select: data => {
      console.log('data', data)
      return data.data
    },
  })
}
