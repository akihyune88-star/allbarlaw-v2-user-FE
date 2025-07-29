import { useState, useEffect, ChangeEvent } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import RequestHeader from '@/container/baroTalk/RequestHeader'
import ProgressButton from '@/components/progressButton/ProgressButton'
import Input from '@/components/input/Input'
import styles from './consultation-content-form.module.scss'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import { useBaroTalkStore } from '@/store/baroTalkStore'

const ConsultationContentForm = () => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 1279px)')

  // Zustand 스토어에서 상태와 액션 가져오기
  const { consultationRequestTitle, consultationRequestDescription, setTitle, setDescription, isStep2Complete } =
    useBaroTalkStore()

  // 로컬 상태로 폼 데이터 관리
  const [title, setTitleLocal] = useState<string>(consultationRequestTitle || '')
  const [description, setDescriptionLocal] = useState<string>(consultationRequestDescription || '')

  // 스토어 값이 변경되면 로컬 상태도 업데이트
  useEffect(() => {
    if (consultationRequestTitle) {
      setTitleLocal(consultationRequestTitle)
    }
    if (consultationRequestDescription) {
      setDescriptionLocal(consultationRequestDescription)
    }
  }, [consultationRequestTitle, consultationRequestDescription])

  const handleCancel = () => {
    navigate(-1) // 이전 페이지로 이동
  }

  const handleNext = () => {
    setTitle(title)
    setDescription(description)
    navigate(ROUTER.BARO_TALK_LAWYER_SELECTION)
  }

  const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTitleLocal(e.target.value)
  }

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionLocal(e.target.value)
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
            value={description}
            onChange={handleDescriptionChange}
          />
          <Input
            title='제목'
            placeholder='AI를 이용하여 제목을 작성 할 수 있습니다.'
            headerChildren={<button className={styles['ai-button']}>AI 자동 제목 만들기</button>}
            className={styles['input-wrapper-title']}
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <ProgressButton
          steps={3}
          currentStep={2}
          onCancel={handleCancel}
          onPrev={() => navigate(ROUTER.REQUEST_BARO_TALK)}
          onNext={handleNext}
          disabled={!title.trim() || !description.trim()} // 제목과 내용이 모두 입력되어야 다음 단계로 이동 가능
        />
      </div>
    </div>
  )
}

export default ConsultationContentForm
