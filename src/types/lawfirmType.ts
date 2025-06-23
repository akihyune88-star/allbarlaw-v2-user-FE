import { SortType } from './sortTypes'

export type LawfirmListRequest = {
  subcategoryId?: number | 'all'
  take?: number
  cursor?: number
  cursorId?: number
  orderBy?: SortType
  recentDays?: string
}

export type Lawfirm = {
  lawfirmId: number
  lawfirmName: string
  lawfirmGreetingTitle: string
  lawfirmGreetingContent: string
  lawfirmLogoImageUrl: string
  lawfirmHomepageUrl: string
  lawfirmAddress: string
  lawfirmContact: string
  lawfirmBlogUrl: string
  lawfirmDirects: {
    lawfirmDirectId: number
    lawfirmDirectName: string
    lawfirmDirectLink: string
  }[]

  lawfirmImages: {
    lawfirmImageId: number
    lawfirmImageUrl: string
  }[]
}

export type LawfirmListResponse = {
  data: Lawfirm[]
  nextCursor: number
  nextCursorId: number
  hasNextPage: boolean
}
