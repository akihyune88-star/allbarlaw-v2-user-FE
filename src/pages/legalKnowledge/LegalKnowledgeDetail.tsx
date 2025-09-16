import AILoading from '@/components/aiLoading/AILoading'
import DetailHeader from '@/components/detailHeader/DetailHeader'
import { useDelayedLoading } from '@/hooks'
import { useGetKnowledgeDetail } from '@/hooks/queries/useGetKnowledgeDetail'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useParams } from 'react-router-dom'
import styles from './legal-knowledge-detail.module.scss'
import ConsultationContentCard from '@/components/consultationContentCard/ConsultationContentCard'
import LawyerResponse from '@/container/legalKnowledge/LawyerResponse'
import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import { getRelativeTimeString } from '@/utils/date'
import { generateRandomLawyers } from '@/utils/mockDataGenerator'
import { useState } from 'react'
import { useKnowledgeKeep } from '@/hooks/queries/useGetKnowledgeList'
import { copyUrlToClipboard } from '@/utils/clipboard'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import { useRecommendationLegalTerm } from '@/hooks/queries/useRecommendation'
import Divider from '@/components/divider/Divider'
import RecentActiveLawyer from '@/container/lawyer/recentActiveLawyer/RecentActiveLawyer'
import { ROUTER } from '@/routes/routerConstant'
import { useNavigate } from 'react-router-dom'

const LegalKnowledgeDetail = () => {
  const { knowledgeId } = useParams<{ knowledgeId: string }>()
  const navigate = useNavigate()
  const { showLoading } = useDelayedLoading({ delay: 3000 })

  const isMobile = useMediaQuery('(max-width: 80rem)')

  const { data } = useGetKnowledgeDetail({ knowledgeId: Number(knowledgeId) })

  const [isKeep, setIsKeep] = useState(data?.isKeep ?? false)

  const { mutate: changeKnowledgeKeep } = useKnowledgeKeep({
    onSuccess: data => {
      setIsKeep(data.isKeep)
    },
    onError: () => {
      setIsKeep(prevState => !prevState)
    },
  })

  const handleShare = () => {
    copyUrlToClipboard()
  }

  const handleSave = () => {
    if (knowledgeId) {
      setIsKeep(prevState => !prevState)
      changeKnowledgeKeep(Number(knowledgeId))
    }
  }

  const handleRequestConsultation = () => {
    navigate(ROUTER.REQUEST_BARO_TALK)
  }

  const mockLawyerList = generateRandomLawyers(5)

  const { data: recommendationLegalTerm } = useRecommendationLegalTerm({
    knowledgeIds: [Number(knowledgeId)],
  })

  return (
    <div className={'detail-container'}>
      <DetailHeader
        title={data?.knowledgeTitle || ''}
        onSave={isMobile ? handleSave : undefined}
        onShare={isMobile ? handleShare : undefined}
        isKeep={isKeep}
      />
      <div className={`detail-body ${styles['detail-body-gap']}`}>
        <div className={styles['detail-content-container']}>
          {showLoading ? (
            <AILoading title='AI가 해당 법률 지식인의 분석중입니다.' />
          ) : (
            <div className={styles['detail-content-container-inner']}>
              <ConsultationContentCard
                content={data?.knowledgeDescription}
                tags={data?.tags}
                lastAnswerTime={data?.lastMessageAt ? getRelativeTimeString(data.lastMessageAt) : ''}
                onShare={handleShare}
                onSave={handleSave}
                isKeep={isKeep}
              />
              {data?.lawyers && <LawyerResponse lawyers={data?.lawyers} />}
              {isMobile && (
                <ContentsRecommender
                  isRefresh={true}
                  title='최근 답변이 많은 변호사입니다.'
                  contents={
                    <div className={styles['lawyer-list']}>
                      {data?.lawyers.map(lawyer => (
                        <LawyerHorizon
                          key={lawyer.lawyerId}
                          lawyerId={lawyer.lawyerId}
                          name={lawyer.lawyerName}
                          profileImage={lawyer.lawyerProfileImage}
                          description={lawyer.lawfirmName}
                          size='x-small'
                        />
                      ))}
                    </div>
                  }
                />
              )}
            </div>
          )}
        </div>
        {!isMobile && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 250 }}>
            <div className={styles['consultation-section']}>
              <div className={styles['consultation-section-header']}>
                <span className={styles['consultation-section-header-title']}>
                  궁금한 내용을
                  <br />
                  질문하세요
                </span>
                <button className={styles['consultation-section-header-button']} onClick={handleRequestConsultation}>
                  변호사 채팅상담하기
                </button>
                <Divider padding={16} />
                <RecentActiveLawyer />
              </div>
            </div>
            {recommendationLegalTerm && recommendationLegalTerm.length > 0 && (
              <LegalTermWidget lagalTermList={recommendationLegalTerm ?? []} />
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default LegalKnowledgeDetail
