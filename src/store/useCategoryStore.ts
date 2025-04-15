import { create } from 'zustand'

interface CategoryStoreState {
  maincategory: number | null
  subcategory: number | null
  setMaincategory: (id: number | null) => void
  setSubcategory: (id: number | null) => void
}

export const useCategoryStore = create<CategoryStoreState>()(set => ({
  maincategory: null,
  subcategory: null,

  //* set 함수
  setMaincategory: id => set({ maincategory: id }),
  setSubcategory: id => set({ subcategory: id }),
}))
