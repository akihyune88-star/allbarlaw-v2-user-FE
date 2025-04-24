import { create } from 'zustand'
import { CategoryList } from '@/types/categoryTypes'

const category = [
  {
    id: 2,
    categoryName: '금융/재산',
    subcategories: [
      {
        id: 2,
        subcategoryName: '사기/공갈',
      },
      {
        id: 12,
        subcategoryName: '절도/재물손괴/주거침입',
      },
      {
        id: 15,
        subcategoryName: '횡령/배임',
      },
    ],
  },
  {
    id: 3,
    categoryName: '음주/교통',
    subcategories: [
      {
        id: 3,
        subcategoryName: '음주운전',
      },
      {
        id: 8,
        subcategoryName: '무면허운전',
      },
      {
        id: 10,
        subcategoryName: '교통사고/보복운전',
      },
      {
        id: 16,
        subcategoryName: '뺑소니',
      },
    ],
  },
  {
    id: 4,
    categoryName: '보이스피싱',
    subcategories: [
      {
        id: 5,
        subcategoryName: '명의대여/도용',
      },
      {
        id: 13,
        subcategoryName: '보이스피싱/유사수신',
      },
    ],
  },
  {
    id: 5,
    categoryName: '도박',
    subcategories: [
      {
        id: 11,
        subcategoryName: '도박',
      },
    ],
  },
  {
    id: 6,
    categoryName: '마약',
    subcategories: [
      {
        id: 14,
        subcategoryName: '마약/대마',
      },
    ],
  },
  {
    id: 7,
    categoryName: '부동산',
    subcategories: [
      {
        id: 24,
        subcategoryName: '명도소송',
      },
      {
        id: 25,
        subcategoryName: '재개발/재건축/지주택',
      },
      {
        id: 26,
        subcategoryName: '하자/누수/층간소음',
      },
      {
        id: 27,
        subcategoryName: '공사대금',
      },
      {
        id: 28,
        subcategoryName: '수용/보상',
      },
      {
        id: 29,
        subcategoryName: '매매/경매',
      },
      {
        id: 30,
        subcategoryName: '권리금/보증금',
      },
      {
        id: 31,
        subcategoryName: '주택/상가임대차',
      },
      {
        id: 32,
        subcategoryName: '기타부동산',
      },
    ],
  },
  {
    id: 8,
    categoryName: '소년/학폭',
    subcategories: [
      {
        id: 6,
        subcategoryName: '아동학대',
      },
      {
        id: 7,
        subcategoryName: '소년사건',
      },
      {
        id: 9,
        subcategoryName: '학교폭력/왕따',
      },
    ],
  },
]

interface CategoryStoreState {
  categoryList: CategoryList
  maincategory: number | null
  subcategory: number | null
  setMaincategory: (id: number | null) => void
  setSubcategory: (id: number | null) => void
}

export const useCategoryStore = create<CategoryStoreState>()(set => ({
  maincategory: null,
  subcategory: null,
  categoryList: category,

  //* set 함수
  setMaincategory: id => set({ maincategory: id }),
  setSubcategory: id => set({ subcategory: id }),
  setCategoryList: (list: CategoryList) => set({ categoryList: list }),
}))
