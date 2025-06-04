import ProgressButton from '@/components/progressButton/ProgressButton'
import ConsultationStatusSelector from '@/container/baroTalk/ConsultationStatusSelector'
import LawyerPreferenceSelector from '@/container/baroTalk/LawyerPreferenceSelector'
import RequestHeader from '@/container/baroTalk/RequestHeader'
import RequestTypeSelector from '@/container/baroTalk/RequestTypeSelector'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ROUTER } from '@/routes/routerConstant'

import { useNavigate } from 'react-router-dom'

// interface CategorySelection {
//   mainCategoryId: number | null
//   subcategoryId: number | null
// }

const RequestBaroTalk = () => {
  // const [selectedCategory, setSelectedCategory] = useState<CategorySelection>({
  //   mainCategoryId: null,
  //   subcategoryId: null,
  // })

  const isMobile = useMediaQuery('(max-width: 1279px)')
  const navigate = useNavigate()

  // const handleMainCategoryClick = (categoryId: number) => {
  //   setSelectedCategory({
  //     mainCategoryId: categoryId,
  //     subcategoryId: null,
  //   })
  // }

  // const handlesubcategoryClick = (subcategoryId: number) => {
  //   setSelectedCategory(prev => ({
  //     ...prev,
  //     subcategoryId,
  //   }))
  // }

  return (
    <div className='form-container'>
      <RequestHeader
        title='법률 상담하기'
        mobileTitle='채팅상담 신청'
        description='채팅상담 및 답변내용은 법률지식인에 공개될 수 있습니다.'
      />

      <div className='form-body'>
        {!isMobile && <p>상담을 위해 아래 항목을 선택해주세요.</p>}

        <ConsultationStatusSelector />
        <RequestTypeSelector />
        <LawyerPreferenceSelector />
        <ProgressButton
          steps={3}
          currentStep={1}
          onCancel={() => navigate(-1)}
          onNext={() => navigate(ROUTER.CONSULTATION_CONTENT_FORM)}
          style={{ marginTop: isMobile ? 0 : 16 }}
        />
      </div>
    </div>
  )
}

export default RequestBaroTalk
