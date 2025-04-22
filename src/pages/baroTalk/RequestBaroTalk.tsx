import Button from '@/components/button/Button'
import StepProgressBar from '@/components/stepProgressBar'
import CategorySelector from '@/container/baroTalk/CategorySelector'
import ConsultationStatusSelector from '@/container/baroTalk/ConsultationStatusSelector'
import LawyerPreferenceSelector from '@/container/baroTalk/LawyerPreferenceSelector'
import RequestHeader from '@/container/baroTalk/RequestHeader'
import RequestTypeSelector from '@/container/baroTalk/RequestTypeSelector'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import styles from '@/pages/baroTalk/request-baro-talk.module.scss'
import { useState } from 'react'

interface CategorySelection {
  mainCategoryId: number | null
  subCategoryId: number | null
}

const renderNavButtons = (isMobile: boolean) => {
  if (isMobile) {
    return (
      <nav className={styles['button-container']}>
        <StepProgressBar steps={3} currentStep={1} className={styles['progress-bar']} />
        <div className={styles['button-wrapper']}>
          <Button variant='normal'>취소</Button>
          <Button variant='fill' size='large' style={{ width: 120 }}>
            저장 및 다음
          </Button>
        </div>
      </nav>
    )
  } else {
    return (
      <nav className={styles['button-container']}>
        <Button variant='normal'>취소</Button>
        <div className={styles['progress-wrapper']}>
          <StepProgressBar steps={3} currentStep={1} className={styles['progress-bar']} />
        </div>
        <Button variant='fill' size='large'>
          저장 및 다음
        </Button>
      </nav>
    )
  }
}

const RequestBaroTalk = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategorySelection>({
    mainCategoryId: null,
    subCategoryId: null,
  })

  const isMobile = useMediaQuery('(max-width: 1200px)')

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
      <RequestHeader
        title='법률 상담하기'
        mobileTitle='채팅상담 신청'
        description='채팅상담 및 답변내용은 법률지식인에 공개될 수 있습니다.'
      />

      <main className={styles['input-container']}>
        {!isMobile && <p className={styles['instruction-text']}>상담을 위해 아래 항목을 선택해주세요.</p>}

        <section className={styles['form-section']}>
          <CategorySelector
            selection={selectedCategory}
            onMainCategoryClick={handleMainCategoryClick}
            onSubCategoryClick={handleSubCategoryClick}
          />
        </section>

        <section className={styles['form-section']}>
          <ConsultationStatusSelector />
        </section>

        <section className={styles['form-section']}>
          <RequestTypeSelector />
        </section>

        <section className={styles['form-section']}>
          <LawyerPreferenceSelector />
        </section>

        {renderNavButtons(isMobile)}
      </main>
    </div>
  )
}

export default RequestBaroTalk
