import { useParams } from 'react-router-dom'
import { useGetKnowledgeDetail } from '@/hooks/queries/useGetKnowledgeDetail'
import styles from './lawyerLegalKnowledgeDetail.module.scss'
import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import ConsultationContentCard from '@/components/consultationContentCard/ConsultationContentCard'
import { getRelativeTimeString } from '@/utils/date'
import DetailHeader from '@/components/detailHeader/DetailHeader'
import LawyerResponse from '@/container/legalKnowledge/LawyerResponse'
import { useLawyerDetailForMe } from '@/hooks/queries/useLawyer'

const LawyerLegalKnowledgeDetail = () => {
  const { knowledgeId } = useParams<{ knowledgeId: string }>()
  const { data: lawyerDetailForMe } = useLawyerDetailForMe()

  const lawyerName = lawyerDetailForMe?.lawyerName || ''

  const { data, isLoading } = useGetKnowledgeDetail({ knowledgeId: Number(knowledgeId) })

  if (isLoading) {
    return <div className={styles['loading']}>로딩 중...</div>
  }

  return (
    <>
      <HeaderPortal>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>{lawyerName} 변호사님을 선택한 법률 지식인 목록입니다. </h1>
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
        {data?.lawyers && (
          <LawyerResponse lawyers={data?.lawyers} className={styles['lawyer-response']} isBaroTalk={false} />
        )}
      </div>
    </>
  )
}

export default LawyerLegalKnowledgeDetail
