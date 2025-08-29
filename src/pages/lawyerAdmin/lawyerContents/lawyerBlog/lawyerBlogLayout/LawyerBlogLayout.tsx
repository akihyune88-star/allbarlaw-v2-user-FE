import SideBar from '@/components/sideBar/SideBar'
import styles from './lawyerBlogLayout.module.scss'
import { useCategory } from '@/hooks/queries/useCategory'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'

export interface LawyerBlogLayoutContext {
  selectedSubcategoryId: number | null
}

const LawyerBlogLayout = () => {
  const { data: categoryList } = useCategory()
  const navigate = useNavigate()
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<number | null>(null)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null)

  const handleMainCategoryClick = (categoryId: number) => {
    setSelectedMainCategoryId(selectedMainCategoryId === categoryId ? null : categoryId)
  }

  const handlesubcategoryClick = (subcategoryId: number) => {
    setSelectedSubcategoryId(subcategoryId)
    navigate(ROUTER.LAWYER_ADMIN_CONTENT_BLOG)
  }
  return (
    <div className={styles['lawyer-blog-layout']}>
      <aside>
        <SideBar
          categories={categoryList || []}
          selectedMainCategory={selectedMainCategoryId}
          selectedSubcategory={selectedSubcategoryId}
          onMainCategoryClick={handleMainCategoryClick}
          onSubcategoryClick={handlesubcategoryClick}
          className={styles['lawyer-blog-layout-side-bar']}
        />
      </aside>
      <section>
        <Outlet context={{ selectedSubcategoryId }} />
      </section>
    </div>
  )
}

export default LawyerBlogLayout
