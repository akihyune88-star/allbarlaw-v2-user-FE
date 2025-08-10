import RequestHeader from '@/container/baroTalk/RequestHeader'
import styles from './baro-talk-lawyer-selection.module.scss'
import { useMemo, useCallback, useEffect } from 'react'
import Input from '@/components/input/Input'
import CheckBoxGroup from '@/components/checkBox/CheckBoxGroup'
import ProgressButton from '@/components/progressButton/ProgressButton'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import BaroTalkLawyersList from '@/container/baroTalk/BaroTalkLawyersList'
import { noticeInputMockData } from '@/constants/baroTalkMockData'
import { ROUTER } from '@/routes/routerConstant'
import { useCreateBaroTalk, useGetBaroTalkLawyerList } from '@/hooks/queries/useBaroTalk'
import { useBaroTalkStore } from '@/store/baroTalkStore'
import { useLawyerSelection } from '@/hooks/useLawyerSelection'
import { useAgreementCheck } from '@/hooks/useAgreementCheck'
import { LOCAL } from '@/constants/local'
import { useLawyer } from '@/hooks/queries/useLawyer'

const BaroTalkLawyerSelection = () => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const selectedLawyerId = sessionStorage.getItem(LOCAL.CHAT_SELECTED_LAWYER_ID)
  const { consultationRequestSubcategoryId, getCreateBaroTalkRequest, reset } = useBaroTalkStore()

  const { selectedLawyers, handleLawyerClick, handleRemoveLawyer, isSelectionValid } = useLawyerSelection(4)
  const { agreementChecked, handleCheckboxChange, isAgreementValid } = useAgreementCheck(['notice'])

  const { data: selectedLawyer } = useLawyer(Number(selectedLawyerId))

  // selectedLawyer가 있을 때 자동으로 선택된 변호사 목록에 추가
  useEffect(() => {
    if (selectedLawyer && selectedLawyerId) {
      // 이미 선택된 변호사인지 확인
      const isAlreadySelected = selectedLawyers.some(lawyer => lawyer.lawyerId === selectedLawyer.lawyerId)

      if (!isAlreadySelected) {
        // 선택되지 않았다면 추가
        handleLawyerClick(selectedLawyer)
      }
    }
  }, [selectedLawyer, selectedLawyerId, selectedLawyers, handleLawyerClick])

  // 태그 배열을 useMemo로 메모이제이션
  const tags = useMemo(
    () => [
      '재물손괴',
      '마약',
      '명예훼손',
      '뇌물',
      '재개발',
      '강간',
      '디지털성범죄',
      '기업법무',
      'M&A',
      '노무',
      '조세불복',
    ],
    []
  )

  // excludeLawyerIds를 useMemo로 메모이제이션
  const excludeLawyerIds = useMemo(() => selectedLawyers.map(lawyer => lawyer.lawyerId), [selectedLawyers])

  const { mutate: createBaroTalk } = useCreateBaroTalk({
    onSuccess: () => {
      reset() // 세션 데이터 초기화
      sessionStorage.removeItem(LOCAL.CHAT_SELECTED_LAWYER_ID) // 채팅 생성 성공 시 세션 정리
      navigate(ROUTER.CHAT)
    },
    onError: (error: Error) => {
      console.error('바로톡 요청 실패:', error)
      // TODO: 에러 처리 로직 (토스트 메시지 등)
    },
  })

  const {
    data: lawyer,
    isLoading,
    error,
    refetch,
  } = useGetBaroTalkLawyerList({
    excludeLawyerIds,
    subcategoryId: consultationRequestSubcategoryId || 1,
    tags,
  })

  const allLawyers = useMemo(() => {
    if (!lawyer) return []
    return lawyer.flatMap(page => page)
  }, [lawyer])

  // 선택되지 않은 변호사들만 필터링 (클라이언트 사이드에서 필터링)
  const filteredLawyers = useMemo(
    () => allLawyers.filter(lawyer => !selectedLawyers.some(sl => sl.lawyerId === lawyer.lawyerId)),
    [allLawyers, selectedLawyers]
  )

  const handleRefresh = useCallback(() => {
    refetch({ throwOnError: false }) // 백그라운드에서 업데이트, 에러 시에도 로딩 상태 표시 안함
  }, [refetch])

  const handleCancel = useCallback(() => {
    sessionStorage.removeItem(LOCAL.CHAT_SELECTED_LAWYER_ID) // 취소 시 세션 정리
    navigate(ROUTER.MAIN)
  }, [navigate])

  const handleNext = useCallback(() => {
    // 선택된 변호사들의 ID 추출
    const selectedLawyerIds = selectedLawyers.map(lawyer => lawyer.lawyerId)

    // 세션에서 모든 데이터를 가져와서 바로톡 요청 생성
    const baroTalkSessionData = getCreateBaroTalkRequest()

    if (baroTalkSessionData) {
      createBaroTalk({
        ...baroTalkSessionData,
        selectedLawyerIds: selectedLawyerIds,
      })
    }
  }, [selectedLawyers, getCreateBaroTalkRequest, createBaroTalk])

  const handlePrev = useCallback(() => {
    // 이전 단계로 갈 때는 세션 유지 (다시 돌아올 수 있도록)
    navigate(ROUTER.CONSULTATION_CONTENT_FORM)
  }, [navigate])

  if (isLoading) {
    return <div>변호사 목록을 불러오는 중...</div>
  }

  if (error) {
    return <div>변호사 목록을 불러오는데 실패했습니다.</div>
  }

  return (
    <main className='form-container'>
      <RequestHeader
        title='법률 상담하기'
        description={
          isMobile ? `상담을 희망하는 변호사를 선택해주세요.\n변호사는 최대 4명까지 선택할 수 있습니다.` : ''
        }
      />
      <section className={`form-body ${styles['body-gap']}`}>
        {!isMobile && (
          <p className={styles['description-text']}>
            {`상담을 희망하는 변호사를 선택해주세요. 
            변호사는 최대 4명까지 선택할 수 있습니다.`}
          </p>
        )}
        <div className={`${styles['lawyer-selection-box']} lawyer-selection-container`}>
          <BaroTalkLawyersList type='selected' lawyers={selectedLawyers} onLawyerClick={handleRemoveLawyer} />
          <BaroTalkLawyersList
            type='recommended'
            lawyers={filteredLawyers}
            onLawyerClick={handleLawyerClick}
            onRefresh={handleRefresh}
          />
          <Input
            title='상담 신청시 필수 안내사항 입니다.'
            className={styles['notice-input']}
            placeholder={noticeInputMockData}
            textAreaStyle={{ fontSize: isMobile ? 12 : 14 }}
            footerChildren={
              <CheckBoxGroup
                options={[{ value: 'notice', label: '질문 유의사항을 모두 확인했으며, 동의합니다.' }]}
                name='notice'
                className={styles['notice-checkbox']}
                values={agreementChecked}
                onChange={handleCheckboxChange}
              />
            }
          />
          <ProgressButton
            steps={3}
            currentStep={3}
            onCancel={handleCancel}
            onNext={handleNext}
            onPrev={handlePrev}
            disabled={!isSelectionValid || !isAgreementValid}
          />
        </div>
      </section>
    </main>
  )
}

export default BaroTalkLawyerSelection
