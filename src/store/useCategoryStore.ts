import { MainCategory, SubCategory } from '@/types/categoryTypes'
import { create } from 'zustand'

interface CategoryStoreState {
  // UI 상태만 관리 (데이터는 React Query로 관리)
  maincategory: MainCategory | null
  subcategory: SubCategory | null
  setMaincategory: (category: MainCategory | null) => void
  setSubcategory: (subcategory: SubCategory | null) => void
}

export const useCategoryStore = create<CategoryStoreState>()(set => ({
  maincategory: null,
  subcategory: null,

  //* set 함수
  setMaincategory: category => set({ maincategory: category }),
  setSubcategory: subcategory => set({ subcategory: subcategory }),
}))
