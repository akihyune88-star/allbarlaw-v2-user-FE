import { useMediaQuery } from '@/hooks/useMediaQuery'
import RequestHeader from '@/container/baroTalk/RequestHeader'
import ProgressButton from '@/components/progressButton/ProgressButton'
import Input from '@/components/input/Input'
import styles from '@/pages/baroTalk/consultation-content-form.module.scss'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'

const ConsultationContentForm = () => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 1279px)')

  const handleCancel = () => {
    navigate(-1) // 이전 페이지로 이동
  }

  return (
    <div className='form-container'>
      <RequestHeader
        title='법률 상담하기'
        description={isMobile ? '채팅상담 및 답변내용은 법률지식인에 공개될 수 있습니다.' : ''}
      />
      <div className={styles['form-body-gap']}>
        <div className={styles['content-wrapper']}>
          {!isMobile && <p>내용을 육하원칙에 따라 작성해주시면 보다 원활한 상담이 가능합니다. </p>}
          <Input
            title='상세내용'
            placeholder='이름, 연락처 등 개인정보가 포함된 내용을 작성하는 경우 상담이 진행되지 않을 수 있습니다.'
            className={styles['input-wrapper-description']}
          />
          <Input
            title='제목'
            placeholder='AI를 이용하여 제목을 작성 할 수 있습니다.'
            headerChildren={<button className={styles['ai-button']}>AI 자동 제목 만들기</button>}
            className={styles['input-wrapper-title']}
          />
        </div>
        <ProgressButton
          steps={3}
          currentStep={2}
          onCancel={handleCancel}
          onPrev={() => navigate(ROUTER.REQUEST_BARO_TALK)}
          onNext={() => navigate(ROUTER.BARO_TALK_LAWYER_SELECTION)}
        />
      </div>
    </div>
  )
}

export default ConsultationContentForm
