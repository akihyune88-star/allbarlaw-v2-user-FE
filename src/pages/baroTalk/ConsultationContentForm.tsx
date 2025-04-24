import { useMediaQuery } from '@/hooks/useMediaQuery'
import RequestHeader from '@/container/baroTalk/RequestHeader'
import { RadioButtonGroup } from '@/components/radioButton'
import ProgressButton from '@/components/progressButton/ProgressButton'
import Input from '@/components/input/Input'
import styles from '@/pages/baroTalk/consultation-content-form.module.scss'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'

const ConsultationContentForm = () => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 1200px)')
  const titleOptions = [
    { value: 'AI 제목 만들기 적용', label: 'AI 제목 만들기 적용' },
    { value: '직접 작성하기', label: '직접 작성하기' },
  ]

  const handleTitleChange = (value: string) => {
    console.log(value)
  }

  const handleCancel = () => {
    navigate(-1) // 이전 페이지로 이동
  }

  return (
    <div className='form-container'>
      <RequestHeader
        title='법률 상담하기'
        mobileTitle='채팅상담 신청'
        description='채팅상담 및 답변내용은 법률지식인에 공개될 수 있습니다.'
      />
      <div className={styles['form-body-gap']}>
        <div className={styles['content-wrapper']}>
          {!isMobile && <p>내용을 육하원칙에 따라 작성해주시면 보다 원활한 상담이 가능합니다. </p>}
          <Input
            title='사건내용 작성'
            placeholder='사건 내용을 300자 이상, 육하원칙에 맞게 작성해주세요.'
            className={styles['input-wrapper-description']}
          />
          <Input
            title='제목 작성'
            placeholder='AI를 이용하여 제목을 작성 할 수 있습니다.'
            headerChildren={
              <RadioButtonGroup
                options={titleOptions}
                name='consultationStatus'
                defaultValue='판결 대기중'
                onChange={handleTitleChange}
                direction='horizontal'
                gap={24}
                gapUnit='px'
              />
            }
            className={styles['input-wrapper-title']}
          />
        </div>
        <ProgressButton
          steps={3}
          currentStep={2}
          onCancel={handleCancel}
          onNext={() => navigate(ROUTER.BARO_TALK_LAWYER_SELECTION)}
        />
      </div>
    </div>
  )
}

export default ConsultationContentForm
