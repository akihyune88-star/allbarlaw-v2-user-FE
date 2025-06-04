export type BlogCountRequest = {
  subCategoryId: number | 'all'
  recentDays: number
}

export interface BlogCase {
  id: number
  title: string
  summaryContents: string
  lawyer: string
  lawfirm: string
  isKeep: boolean
  thumbnail: string
  tagList: string[]
}
