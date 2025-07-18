type NoticeType = {
  noticeTypeId: number
  noticeTypeKey: string
  noticeTypeName: string
}

export type NoticeTypeResponse = NoticeType[] | { data: NoticeType[] }

interface Notice {
  noticeId: number
  noticeTypeId: number
  noticeTitle: string
  noticeCreatedAt: string
}

export type NoticeListRequest = {
  take?: number
  cursor?: number
  cursorId?: number
  typeId?: 'all' | number
  // orderBy?: SortType
}

export type NoticeListResponse = {
  data: Notice[]
  nextCursor: number
  nextCursorId: number
  hasNextPage: boolean
}

interface NoticeDetail extends Notice {
  noticeContent: string
}

export type NoticeDetailResponse = NoticeDetail

type Faq = {
  faqId: number
  faqTypeId: number
  faqTitle: string
  faqCreatedAt: string
}

export type FaqType = {
  faqTypeId: number
  faqTypeName: string
}

export type FaqTypeResponse = FaqType[] | { data: FaqType[] }

export type FaqListRequest = {
  take?: number
  cursor?: number
  cursorId?: number
}

export type SupportListResponse = {
  data: Notice[] | Faq[]
  nextCursor: number
  nextCursorId: number
  hasNextPage: boolean
}
