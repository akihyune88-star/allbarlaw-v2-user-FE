import { Category, SubCategory } from '@/types/categoryTypes'
import { create } from 'zustand'

interface CategoryStoreState {
  // UI 상태만 관리 (데이터는 React Query로 관리)
  category: Category | null
  subcategory: SubCategory | null
  setCategory: (category: Category | null) => void
  setSubcategory: (subcategory: SubCategory | null) => void
}

export const useCategoryStore = create<CategoryStoreState>()(set => ({
  category: null,
  subcategory: null,

  //* set 함수
  setCategory: category => set({ category: category }),
  setSubcategory: subcategory => set({ subcategory: subcategory }),
}))
