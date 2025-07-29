import CategorySelector from '@/components/categorySelector/CategorySelector'
import ProgressButton from '@/components/progressButton/ProgressButton'
import RequestHeader from '@/container/baroTalk/RequestHeader'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ROUTER } from '@/routes/routerConstant'
import { useBaroTalkStore } from '@/store/baroTalkStore'

import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const RequestBaroTalk = () => {
  const isMobile = useMediaQuery('(max-width: 1279px)')
  const navigate = useNavigate()

  // 세션에 저장된 값을  초기 값으로 사용
  const { consultationRequestSubcategoryId, setSubcategoryId } = useBaroTalkStore()
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(
    consultationRequestSubcategoryId || null
  )

  // 세션 값이 변경되면 로컬 상태도 업데이트
  useEffect(() => {
    if (consultationRequestSubcategoryId) {
      setSelectedSubcategoryId(consultationRequestSubcategoryId)
    }
  }, [consultationRequestSubcategoryId])

  const handleSubcategoryClick = (category: any, subcategory: any) =>
    setSelectedSubcategoryId(subcategory.subcategoryId)

  const handleNext = () => {
    if (selectedSubcategoryId) {
      setSubcategoryId(selectedSubcategoryId)
      navigate(ROUTER.CONSULTATION_CONTENT_FORM)
    }
  }

  return (
    <div className='form-container'>
      <RequestHeader title='법률 상담하기' description={isMobile ? '상담을 위해 아래 항목을 선택해주세요.' : ''} />

      <div className='main-container'>
        {!isMobile && <p>상담을 위해 아래 항목을 선택해주세요.</p>}

        <CategorySelector
          onSubcategoryClick={handleSubcategoryClick}
          defaultSubcategoryId={consultationRequestSubcategoryId || undefined}
        />

        <div style={{ padding: isMobile ? '1.25rem' : '1.5rem' }}>
          <ProgressButton
            steps={3}
            currentStep={1}
            onCancel={() => navigate(-1)}
            onNext={handleNext}
            style={{ marginTop: isMobile ? 0 : 16 }}
            disabled={!selectedSubcategoryId} // 서브카테고리가 선택되지 않으면 버튼 비활성화
          />
        </div>
      </div>
    </div>
  )
}

export default RequestBaroTalk
