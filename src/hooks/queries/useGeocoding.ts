import { geocodingService } from '@/services/geocodingService'
import { GeocodingResponse } from '@/types/geocodingTypes'
import { useMutation } from '@tanstack/react-query'

export const useGeocoding = ({
  onSuccess,
  onError,
}: {
  onSuccess: (_data: GeocodingResponse) => void
  onError: (_error: Error) => void
}) => {
  return useMutation({
    mutationFn: (searchQuery: string) => geocodingService.getAddress(searchQuery),
    onSuccess: data => {
      onSuccess(data)
    },
    onError: error => {
      onError(error)
    },
  })
}
