type FilterCase = {
  filterName: string
  sortType: string
}

export const LAWFIRM_SORT_FILTER_CASE: FilterCase[] = [
  {
    filterName: '전체',
    sortType: 'createdAt',
  },
  {
    filterName: '인기 로펌',
    sortType: 'viewCount',
  },
  {
    filterName: '최근 등록 로펌',
    sortType: 'createdAt',
  },
]

export const LAWFIRM_PERIOD_FILTER_CASE = [
  {
    filterName: '전체',
    sortType: 'all',
  },
  {
    filterName: '일주일 이내',
    sortType: '7',
  },
  {
    filterName: '한달 이내',
    sortType: '30',
  },
]

export const LAWYER_SORT_ACHIEVEMENT_CASE: FilterCase[] = [
  {
    filterName: '전체',
    sortType: 'all',
  },
  {
    filterName: '스피드 답변왕',
    sortType: '1',
  },
  {
    filterName: '공감왕',
    sortType: '2',
  },
  {
    filterName: '최근 등록 로펌',
    sortType: '3',
  },
]
