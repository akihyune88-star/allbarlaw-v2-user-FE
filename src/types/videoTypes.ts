export type VideoCountRequest = {
  subcategoryId: number | 'all'
  recentDays: number | 'all'
}

export type VideoListRequest = {
  subcategoryId?: number | 'all'
  take?: number
  cursor?: number
  cursorId?: number
  orderBy?: 'createdAt' | 'viewCount' | 'likesCount'
}

export interface VideoCase {
  videoCaseId: number
  title: string
  thumbnail: string
  channelName: string
  channelThumbnail: string
  lawyerName: string
  lawfirmName: string
  subcategoryId: number
  isKeep: boolean
}

export type VideoListResponse = {
  data: VideoCase[]
  nextCursor: number
  nextCursorId: number
  hasNextPage: boolean
}
