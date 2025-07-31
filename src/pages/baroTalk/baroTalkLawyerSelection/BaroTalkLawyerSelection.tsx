import RequestHeader from '@/container/baroTalk/RequestHeader'
import styles from './baro-talk-lawyer-selection.module.scss'
import { useMemo } from 'react'
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
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useAgreementCheck } from '@/hooks/useAgreementCheck'

const BaroTalkLawyerSelection = () => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 80rem)')

  // Zustand 스토어에서 모든 바로톡 요청 데이터 가져오기
  const { consultationRequestSubcategoryId, getCreateBaroTalkRequest, reset } = useBaroTalkStore()

  const { selectedLawyers, handleLawyerClick, handleRemoveLawyer, isSelectionValid } = useLawyerSelection(4)
  const { agreementChecked, handleCheckboxChange, isAgreementValid } = useAgreementCheck(['notice'])

  const { mutate: createBaroTalk } = useCreateBaroTalk({
    onSuccess: () => {
      reset() // 세션 데이터 초기화
      navigate(ROUTER.CHAT)
    },
    onError: (error: Error) => {
      console.error('바로톡 요청 실패:', error)
      // TODO: 에러 처리 로직 (토스트 메시지 등)
    },
  })

  // 변호사 리스트 무한스크롤 훅 사용
  const {
    data: lawyerPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useGetBaroTalkLawyerList({
    consultationRequestId: 1, // TODO: 실제 consultationRequestId 사용
    subcategoryId: consultationRequestSubcategoryId || 1,
  })

  // 무한 스크롤 훅 사용
  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  })

  // 모든 변호사 데이터를 하나의 배열로 합치기
  const allLawyers = useMemo(() => {
    if (!lawyerPages) return []
    return lawyerPages.pages.flatMap(page => page.lawyers)
  }, [lawyerPages])

  // 선택되지 않은 변호사들만 필터링
  const filteredLawyers = useMemo(
    () => allLawyers.filter(lawyer => !selectedLawyers.some(sl => sl.lawyerId === lawyer.lawyerId)),
    [allLawyers, selectedLawyers]
  )

  const handleRefresh = () => {
    console.log('새로고침 요청')
    // TODO: 쿼리 리페치 로직 구현
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const handleNext = () => {
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
  }

  const handlePrev = () => {
    navigate(ROUTER.CONSULTATION_CONTENT_FORM)
  }

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
