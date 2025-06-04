import { useEffect } from 'react'
import { useCategoriesQuery } from './queries/useCategoriesQuery'

type Selection = {
  mainCategoryId: number | null
  subCategoryId: number | null
}

/**
 * 카테고리 관련 로직을 관리하는 커스텀 훅
 *
 * @param selection 현재 선택된 카테고리 정보
 * @param onMainCategoryClick 메인 카테고리 선택 핸들러
 * @returns 카테고리 상태 및 선택된 카테고리 정보
 */
export const useCategories = (selection: Selection, onMainCategoryClick: (id: number) => void) => {
  const { data: categoryList } = useCategoriesQuery()

  // 초기 카테고리 설정
  useEffect(() => {
    if (categoryList && categoryList.length > 0 && selection.mainCategoryId === null) {
      onMainCategoryClick(categoryList[0].id)
    }
  }, [categoryList, selection.mainCategoryId, onMainCategoryClick])

  // 선택된 카테고리 찾기
  const selectedMainCategory = categoryList?.find(cat => cat.id === selection.mainCategoryId) || null
  const selectedSubCategory =
    selectedMainCategory?.subcategories.find(sub => sub.id === selection.subCategoryId) || null

  return {
    categoryList,
    selectedMainCategory,
    selectedSubCategory,
  }
}
