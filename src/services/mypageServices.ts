import instance from '@/lib/axios'
import { BlogListRequest } from '@/types/blogTypes'
import { KnowledgeListRequest, KnowledgeListResponse } from '@/types/knowledgeType'
import { LawyerListRequest } from '@/types/lawyerTypes'
import { LegalTermListRequest } from '@/types/legalTermTypes'
import { VideoListRequest } from '@/types/videoTypes'

export const mypageService = {
  getMyBlogList: async (request: BlogListRequest) => {
    console.log(request, 'request')
    const { take, cursor, cursorId, sort } = request

    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
    if (sort !== undefined) params.append('sort', sort)

    const queryString = params.toString()

    const url = `/mypage/blog-cases${queryString ? `?${queryString}` : ''}`

    const response = await instance.get(url)
    return response.data
  },

  getMyVideoList: async (request: VideoListRequest) => {
    const { take, cursor, cursorId, sort } = request

    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
    if (sort !== undefined) params.append('sort', sort)

    const queryString = params.toString()
    const url = `/mypage/video-cases${queryString ? `?${queryString}` : ''}`

    const response = await instance.get(url)
    return response.data
  },

  getMyLegalKnowledgeList: async (request: KnowledgeListRequest) => {
    const { take, cursor, cursorId, sort } = request

    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
    if (sort !== undefined) params.append('sort', sort)

    const queryString = params.toString()
    const url = `/mypage/knowledge${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<KnowledgeListResponse>(url)
    return response.data
  },

  getMyLawyerList: async (request: LawyerListRequest) => {
    const { take, cursor, cursorId, sort } = request

    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
    if (sort !== undefined) params.append('sort', sort)

    const queryString = params.toString()
    const url = `/mypage/lawyers${queryString ? `?${queryString}` : ''}`

    const response = await instance.get(url)
    return response.data
  },

  getMyLegalDictionaryList: async (request: LegalTermListRequest) => {
    const { take, cursor, cursorId, sort } = request

    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
    if (sort !== undefined) params.append('sort', sort)

    const queryString = params.toString()
    const url = `/mypage/legal-terms${queryString ? `?${queryString}` : ''}`

    const response = await instance.get(url)
    return response.data
  },
}
