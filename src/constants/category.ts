import { SortType } from '@/types/sortTypes'

export const SORT_CASE: { key: SortType; name: string }[] = [
  {
    key: 'all',
    name: '전체',
  },
  {
    key: 'viewCount',
    name: '추천수',
  },
  {
    key: 'likesCount',
    name: '공감순',
  },
  {
    key: 'createdAt',
    name: '최신순',
  },
] as const
