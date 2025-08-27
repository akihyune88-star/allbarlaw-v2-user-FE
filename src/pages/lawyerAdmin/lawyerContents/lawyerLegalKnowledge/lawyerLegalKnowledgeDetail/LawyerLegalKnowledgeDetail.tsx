import { useParams, useNavigate } from 'react-router-dom'
import { useGetKnowledgeDetail } from '@/hooks/queries/useGetKnowledgeDetail'
import styles from './lawyerLegalKnowledgeDetail.module.scss'
import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import { ROUTER } from '@/routes/routerConstant'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
// import { formatDate } from '@/utils/date'

const LawyerLegalKnowledgeDetail = () => {
  const { knowledgeId } = useParams<{ knowledgeId: string }>()
  const navigate = useNavigate()
  const { data: knowledge, isLoading } = useGetKnowledgeDetail({ knowledgeId: Number(knowledgeId) })

  const handleGoBack = () => {
    navigate(ROUTER.LAWYER_ADMIN_CONTENT_LEGAL_KNOWLEDGE)
  }

  if (isLoading) {
    return <div className={styles['loading']}>로딩 중...</div>
  }

  if (!knowledge) {
    return <div className={styles['error']}>법률 지식인을 찾을 수 없습니다.</div>
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
        <div className={styles['legal-knowledge-detail-content']}>
          <LegalKnowledgeItem
            knowledgeKeep={knowledge.isKeep}
            knowledgeId={knowledge.knowledgeId}
            title={knowledge.knowledgeTitle}
            description={knowledge.knowledgeDescription}
            time={new Date(knowledge.lastMessageAt)}
            lawyerList={knowledge.lawyers || []}
            isLastAnswer={true}
            isShowKeep={false}
          />

          {knowledge.knowledgeDescription && (
            <div className={styles['legal-knowledge-detail-body']}>
              <h2>상세 내용</h2>
              <div className={styles['content']} dangerouslySetInnerHTML={{ __html: knowledge.knowledgeDescription }} />
            </div>
          )}

          {/* {knowledge. && knowledge.knowledgeAnswers.length > 0 && (
            <div className={styles['legal-knowledge-detail-answers']}>
              <h2>변호사 답변</h2>
              {knowledge.knowledgeAnswers.map((answer, index) => (
                <div key={index} className={styles['answer-item']}>
                  <div className={styles['answer-header']}>
                    <div className={styles['lawyer-info']}>
                      <img src={answer.lawyerProfileImage} alt={answer.lawyerName} />
                      <div>
                        <h3>{answer.lawyerName} 변호사</h3>
                        <p>{answer.lawfirmName}</p>
                      </div>
                    </div>
                    <span className={styles['answer-date']}>{formatDate(new Date(answer.createdAt))}</span>
                  </div>
                  <div className={styles['answer-content']}>{answer.content}</div>
                </div>
              ))}
            </div>
          )} */}
        </div>
      </div>
    </>
  )
}

export default LawyerLegalKnowledgeDetail
