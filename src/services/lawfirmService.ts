import instance from '@/lib/axios'
import { LawfirmListRequest, LawfirmListResponse } from '@/types/lawfirmType'

export const lawfirmService = {
  getLawfirmList: async (request: LawfirmListRequest) => {
    const { subcategoryId, take, cursor, cursorId, orderBy } = request

    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
    if (orderBy !== undefined) params.append('orderBy', orderBy)

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/lawfirm/${subcategoryId}${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<LawfirmListResponse>(url)

    return response.data
  },

  postTrackView: async (id: number) => {
    const response = await instance.post<string>(`/lawfirm/${id}/view`)
    return response.data
  },
}
