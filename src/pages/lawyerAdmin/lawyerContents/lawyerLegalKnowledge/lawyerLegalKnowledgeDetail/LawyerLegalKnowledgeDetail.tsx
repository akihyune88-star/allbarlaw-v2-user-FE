import { useParams, useNavigate } from 'react-router-dom'
import { useGetKnowledgeDetail } from '@/hooks/queries/useGetKnowledgeDetail'
import styles from './lawyerLegalKnowledgeDetail.module.scss'
import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import { ROUTER } from '@/routes/routerConstant'
import ConsultationContentCard from '@/components/consultationContentCard/ConsultationContentCard'
import { getRelativeTimeString } from '@/utils/date'
import DetailHeader from '@/components/detailHeader/DetailHeader'
import LawyerResponse from '@/container/legalKnowledge/LawyerResponse'

const LawyerLegalKnowledgeDetail = () => {
  const { knowledgeId } = useParams<{ knowledgeId: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useGetKnowledgeDetail({ knowledgeId: Number(knowledgeId) })

  const handleGoBack = () => {
    navigate(ROUTER.LAWYER_ADMIN_CONTENT_LEGAL_KNOWLEDGE)
  }

  if (isLoading) {
    return <div className={styles['loading']}>로딩 중...</div>
  }

  return (
    <>
      <HeaderPortal>
        <div className={styles.headerContent}>
          <button className={styles.backButton} onClick={handleGoBack}>
            ← 목록으로
          </button>
          <h1 className={styles.headerTitle}>법률 지식인 상세</h1>
        </div>
      </HeaderPortal>
      <div className={styles['legal-knowledge-detail']}>
        <DetailHeader title={data?.knowledgeTitle || ''} className={styles['detail-header']} />

        <ConsultationContentCard
          content={data?.knowledgeDescription}
          tags={data?.tags}
          lastAnswerTime={data?.lastMessageAt ? getRelativeTimeString(data.lastMessageAt) : ''}
          className={styles['consultation-content-card']}
        />
        {data?.lawyers && <LawyerResponse lawyers={data?.lawyers} className={styles['lawyer-response']} />}
      </div>
    </>
  )
}

export default LawyerLegalKnowledgeDetail
