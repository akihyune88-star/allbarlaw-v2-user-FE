type NoticeType = {
  noticeTypeId: number
  noticeTypeKey: string
  noticeTypeName: string
}

export type NoticeTypeResponse = NoticeType[] | { data: NoticeType[] }
