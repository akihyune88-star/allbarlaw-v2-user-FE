type FilterCase = {
  filterName: string
  sortType: string
}

export const LAWFIRM_SORT_FILTER_CASE: FilterCase[] = [
  {
    filterName: '전체',
    sortType: 'all',
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
  //orderby
  {
    filterName: '경력 높은 순',
    sortType: 'careerDesc',
  },
  {
    filterName: '경력 낮은 순',
    sortType: 'careerAsc',
  },
  {
    filterName: '등록 오랜 순',
    sortType: 'createdAtAsc',
  },
  {
    filterName: '등록 오랜 순',
    sortType: 'createdAtDesc',
  },
]

export const LAWYER_SORT_REGION_CASE: FilterCase[] = [
  {
    filterName: '전체',
    sortType: 'all',
  },
  {
    filterName: '서울',
    sortType: '서울',
  },
  {
    filterName: '경기도',
    sortType: '경기도',
  },
  {
    filterName: '대전',
    sortType: '대전',
  },
  {
    filterName: '대구',
    sortType: '대구',
  },
  {
    filterName: '부산',
    sortType: '부산',
  },
  {
    filterName: '울산',
    sortType: '울산',
  },
  {
    filterName: '제주',
    sortType: '제주',
  },
  {
    filterName: '충청북도',
    sortType: '충청북도',
  },
  {
    filterName: '충청남도',
    sortType: '충청남도',
  },
  {
    filterName: '경상북도',
    sortType: '경상북도',
  },
  {
    filterName: '경상남도',
    sortType: '경상남도',
  },
  {
    filterName: '전라북도',
    sortType: '전라북도',
  },
  {
    filterName: '전라남도',
    sortType: '전라남도',
  },
]

export const LAWYER_SORT_GENDER_CASE: FilterCase[] = [
  {
    filterName: '전체',
    sortType: 'all',
  },
  {
    filterName: '남자변호사',
    sortType: '0',
  },
  {
    filterName: '여자변호사',
    sortType: '1',
  },
]
