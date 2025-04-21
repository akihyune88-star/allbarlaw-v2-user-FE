import Button from '@/components/button/Button'
import StepProgressBar from '@/components/stepProgressBar'
import CategorySelector from '@/container/baroTalk/CategorySelector'
import ConsultationStatusSelector from '@/container/baroTalk/ConsultationStatusSelector'
import LawyerPreferenceSelector from '@/container/baroTalk/LawyerPreferenceSelector'
import RequestTypeSelector from '@/container/baroTalk/RequestTypeSelector'
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
        <p>상담을 위해 아래 항목을 선택해주세요.</p>
        <CategorySelector
          selection={selectedCategory}
          onMainCategoryClick={handleMainCategoryClick}
          onSubCategoryClick={handleSubCategoryClick}
        />
        <ConsultationStatusSelector />
        <RequestTypeSelector />
        <LawyerPreferenceSelector />
        <div className={styles['button-container']}>
          <Button variant='normal'>취소</Button>
          <div style={{ width: 282 }}>
            <StepProgressBar steps={3} currentStep={2} className={styles['progress-bar']} />
          </div>
          <Button variant='fill' size='large'>
            저장 및 다음
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RequestBaroTalk
