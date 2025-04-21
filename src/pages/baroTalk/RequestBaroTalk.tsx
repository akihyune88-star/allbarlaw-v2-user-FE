import CategorySelector from '@/container/baroTalk/CategorySelector'
import styles from '@/pages/baroTalk/request-baro-talk.module.scss'
import { useState } from 'react'

interface CategorySelection {
  mainCategoryId: number | null
  subCategoryId: number | null
}

const TitleHeader = () => {
  return (
    <header>
      <h1>법률 상담하기</h1>
    </header>
  )
}

const RequestBaroTalk = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategorySelection>({
    mainCategoryId: null,
    subCategoryId: null,
  })

  const handleMainCategoryClick = (categoryId: number) => {
    setSelectedCategory({
      mainCategoryId: categoryId,
      subCategoryId: null,
    })
  }

  const handleSubCategoryClick = (subCategoryId: number) => {
    setSelectedCategory(prev => ({
      ...prev,
      subCategoryId,
    }))
  }

  return (
    <div className={styles['request-baro-talk']}>
      <TitleHeader />
      <div className={styles['input-container']}>
        <CategorySelector
          selection={selectedCategory}
          onMainCategoryClick={handleMainCategoryClick}
          onSubCategoryClick={handleSubCategoryClick}
        />
      </div>
    </div>
  )
}

export default RequestBaroTalk
