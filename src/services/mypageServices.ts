import instance from '@/lib/axios'
import { BlogListRequest } from '@/types/blogTypes'
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
}
