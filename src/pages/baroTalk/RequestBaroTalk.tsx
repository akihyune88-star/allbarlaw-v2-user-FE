import CategorySelector from '@/components/categorySelector/CategorySelector'
import ProgressButton from '@/components/progressButton/ProgressButton'
import RequestHeader from '@/container/baroTalk/RequestHeader'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ROUTER } from '@/routes/routerConstant'

import { useNavigate } from 'react-router-dom'

const RequestBaroTalk = () => {
  const isMobile = useMediaQuery('(max-width: 1279px)')
  const navigate = useNavigate()

  return (
    <div className='form-container'>
      <RequestHeader title='법률 상담하기' description={isMobile ? '상담을 위해 아래 항목을 선택해주세요.' : ''} />

      <div className='main-container'>
        {!isMobile && <p>상담을 위해 아래 항목을 선택해주세요.</p>}

        <CategorySelector />

        <div style={{ padding: isMobile ? '1.25rem' : '1.5rem' }}>
          <ProgressButton
            steps={3}
            currentStep={1}
            onCancel={() => navigate(-1)}
            onNext={() => navigate(ROUTER.CONSULTATION_CONTENT_FORM)}
            style={{ marginTop: isMobile ? 0 : 16 }}
          />
        </div>
      </div>
    </div>
  )
}

export default RequestBaroTalk
