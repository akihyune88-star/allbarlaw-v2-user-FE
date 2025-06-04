import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SideBar from '@/components/sideBar/SideBar'
import styles from './main-side-bar.module.scss'
import CategoryLoading from '@/container/main/categoryLoading/CategoryLoading'
import { useCategory } from '@/hooks/queries/useCategory'

const MainSideBar = () => {
  const navigate = useNavigate()
  const { subCategoryId } = useParams<{ subCategoryId: string }>()
  const { data: categoryList, isLoading, isError } = useCategory()

  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<number | null>(null)
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null)

  // URL 파라미터를 기반으로 초기 선택 상태 설정
  useEffect(() => {
    if (subCategoryId && categoryList) {
      const currentSubCategoryId = Number(subCategoryId)
      setSelectedSubCategoryId(currentSubCategoryId)

      // 해당 서브카테고리가 속한 메인카테고리 찾기
      const mainCategory = categoryList.find(category =>
        category.subcategories.some(sub => sub.subcategoryId === currentSubCategoryId)
      )

      if (mainCategory) {
        setSelectedMainCategoryId(mainCategory.categoryId)
      }
    }
  }, [subCategoryId, categoryList])

  const handleMainCategoryClick = (categoryId: number) => {
    setSelectedMainCategoryId(categoryId)
    setSelectedSubCategoryId(null) // 메인 카테고리 변경 시 서브 카테고리 선택 해제
  }

  const handleSubCategoryClick = (subcategoryId: number) => {
    setSelectedSubCategoryId(subcategoryId)
    navigate(`/${subcategoryId}`)
  }

  return (
    <aside className={styles['sidebar-container']}>
      {isLoading ? (
        <CategoryLoading />
      ) : isError ? (
        <div className={styles['error-state']}>
          <p>카테고리를 불러올 수 없습니다.</p>
        </div>
      ) : categoryList ? (
        <SideBar
          categories={categoryList}
          selectedMainCategory={selectedMainCategoryId}
          selectedSubCategory={selectedSubCategoryId}
          onMainCategoryClick={handleMainCategoryClick}
          onSubCategoryClick={handleSubCategoryClick}
        />
      ) : (
        <div className={styles['empty-state']}>
          <p>카테고리가 없습니다.</p>
        </div>
      )}
    </aside>
  )
}

export default MainSideBar
