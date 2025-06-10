import instance from '@/lib/axios'
import { KnowledgeListRequest } from '@/types/knowledgeType'

export const knowledgeService = {
  getKnowledgeList: async (request: KnowledgeListRequest) => {
    const { subcategoryId, take, cursor, cursorId, orderBy } = request

    // 쿼리 파라미터 객체 생성 (값이 있을 때만 포함)
    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
    if (orderBy !== undefined) params.append('orderBy', orderBy)

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/knowledge/${subcategoryId}${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<KnowledgeListRequest[]>(url)

    return response.data
  },
}
