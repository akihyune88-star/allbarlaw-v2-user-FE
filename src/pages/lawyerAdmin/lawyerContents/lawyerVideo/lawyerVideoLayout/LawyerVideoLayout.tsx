import SideBar from '@/components/sideBar/SideBar'
import styles from './lawyerVideoLayout.module.scss'
import { useCategory } from '@/hooks/queries/useCategory'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

export interface LawyerVideoLayoutContext {
  selectedSubcategoryId: number | null
}

const LawyerVideoLayout = () => {
  const { data: categoryList } = useCategory()
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<number | null>(null)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null)

  const handleMainCategoryClick = (categoryId: number) => {
    setSelectedMainCategoryId(selectedMainCategoryId === categoryId ? null : categoryId)
  }

  const handlesubcategoryClick = (subcategoryId: number) => {
    setSelectedSubcategoryId(subcategoryId)
  }
  return (
    <div className={styles['lawyer-video-layout']}>
      <aside>
        <SideBar
          categories={categoryList || []}
          selectedMainCategory={selectedMainCategoryId}
          selectedSubcategory={selectedSubcategoryId}
          onMainCategoryClick={handleMainCategoryClick}
          onSubcategoryClick={handlesubcategoryClick}
          className={styles['lawyer-video-layout-side-bar']}
        />
      </aside>
      <section>
        <Outlet context={{ selectedSubcategoryId }} />
      </section>
    </div>
  )
}

export default LawyerVideoLayout