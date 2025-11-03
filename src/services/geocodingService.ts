import instance from '@/lib/axios'
import { GeocodingResponse } from '@/types/geocodingTypes'

export const geocodingService = {
  getAddress: async (query: string) => {
    const response = await instance.post<GeocodingResponse>(`/api/v1/geocoding/forward`, { query })
    return response.data
  },
}
