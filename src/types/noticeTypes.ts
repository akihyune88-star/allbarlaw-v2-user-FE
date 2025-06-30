type NoticeType = {
  noticeTypeId: number
  noticeTypeKey: string
  noticeTypeName: string
}

export type NoticeTypeResponse = NoticeType[] | { data: NoticeType[] }

type Notice = {
  noticeId: number
  noticeTypeId: number
  noticeTitle: string
  noticeCreatedAt: string
}

export type NoticeListRequest = {
  take?: number
  cursor?: number
  cursorId?: number
  // orderBy?: SortType
}

export type NoticeListResponse = {
  data: Notice[]
  nextCursor: number
  nextCursorId: number
  hasNextPage: boolean
}
