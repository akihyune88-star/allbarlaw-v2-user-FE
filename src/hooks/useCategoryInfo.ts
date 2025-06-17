import { useMemo } from 'react'
import { useCategory } from '@/hooks/queries/useCategory'

export type CategoryInfo = {
  mainCategory: {
    categoryId: number
    categoryName: string
  }
  subcategory: {
    subcategoryId: number
    subcategoryName: string
  }
}

export const useCategoryInfo = (subcategoryId: string | undefined) => {
  const { data: categoryList } = useCategory()

  return useMemo(() => {
    if (!subcategoryId || !categoryList) return null

    const currentsubcategoryId = Number(subcategoryId)

    for (const category of categoryList) {
      const subcategory = category.subcategories.find(sub => sub.subcategoryId === currentsubcategoryId)
      if (subcategory) {
        return {
          mainCategory: {
            categoryId: category.categoryId,
            categoryName: category.categoryName,
          },
          subcategory: {
            subcategoryId: subcategory.subcategoryId,
            subcategoryName: subcategory.subcategoryName,
          },
        }
      }
    }
    return null
  }, [subcategoryId, categoryList])
}
