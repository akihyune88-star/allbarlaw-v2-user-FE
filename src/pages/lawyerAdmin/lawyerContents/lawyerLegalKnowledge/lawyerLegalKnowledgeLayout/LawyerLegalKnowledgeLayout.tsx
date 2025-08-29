import SideBar from '@/components/sideBar/SideBar'
import styles from './lawyerLegalKnowledgeLayout.module.scss'
import { useCategory } from '@/hooks/queries/useCategory'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'

export interface LawyerLegalKnowledgeLayoutContext {
  selectedSubcategoryId: number | null
}

const LawyerLegalKnowledgeLayout = () => {
  const { data: categoryList } = useCategory()
  const navigate = useNavigate()
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<number | null>(null)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null)

  const handleMainCategoryClick = (categoryId: number) => {
    setSelectedMainCategoryId(selectedMainCategoryId === categoryId ? null : categoryId)
  }

  const handlesubcategoryClick = (subcategoryId: number) => {
    setSelectedSubcategoryId(subcategoryId)
    navigate(ROUTER.LAWYER_ADMIN_CONTENT_LEGAL_KNOWLEDGE)
  }
  return (
    <div className={styles['lawyer-legal-knowledge-layout']}>
      <aside>
        <SideBar
          categories={categoryList || []}
          selectedMainCategory={selectedMainCategoryId}
          selectedSubcategory={selectedSubcategoryId}
          onMainCategoryClick={handleMainCategoryClick}
          onSubcategoryClick={handlesubcategoryClick}
          className={styles['lawyer-legal-knowledge-layout-side-bar']}
        />
      </aside>
      <section>
        <Outlet context={{ selectedSubcategoryId }} />
      </section>
    </div>
  )
}

export default LawyerLegalKnowledgeLayout