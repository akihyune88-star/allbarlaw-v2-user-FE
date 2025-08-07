import Divider from '@/components/divider/Divider'
import SvgIcon from '@/components/SvgIcon'
import styles from './lawyerLegalKnowledge.module.scss'
import { useGetKnowledgeList } from '@/hooks/queries/useGetKnowledgeList'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import { forwardRef } from 'react'
import { LawyerDetailResponse } from '@/types/lawyerTypes'

type LawyerLegalKnowledgeProps = {
  knowledgeList: LawyerDetailResponse['knowledgeAnswers'] | []
}

const LawyerLegalKnowledge = forwardRef<HTMLElement, LawyerLegalKnowledgeProps>(({ knowledgeList = [] }, ref) => {
  const hasKnowledge = knowledgeList.length > 0

  return (
    <section ref={ref} className={styles['lawyer-legal-knowledge']} aria-label='변호사의 법률 지식'>
      <header className={styles['lawyer-legal-knowledge__header']}>
        <h3 className={styles['lawyer-legal-knowledge__title']}>변호사의 법률 지식</h3>
        {hasKnowledge && (
          <button
            type='button'
            className={styles['lawyer-legal-knowledge__button']}
            aria-label='변호사의 법률 지식 더보기'
          >
            더보기
            <SvgIcon name='arrowSmall' className={styles['lawyer-legal-knowledge__button-icon']} size={14} />
          </button>
        )}
      </header>
      <Divider padding={14} />
      {hasKnowledge ? (
        <ul className={styles['lawyer-legal-knowledge__list']} role='list'>
          {knowledgeList.map((knowledge, index) => (
            <li key={knowledge.knowledgeId}>
              <LegalKnowledgeItem
                title={knowledge.knowledgeTitle}
                description={knowledge.summaryContent}
                isLastAnswer={false}
              />
              {index !== knowledgeList.length - 1 && (
                <Divider padding={24} className={styles['lawyer-legal-knowledge__divider']} />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles['lawyer-legal-knowledge__empty']}>
          <p className={styles['lawyer-legal-knowledge__empty-text']}>등록된 법률 지식이 없습니다</p>
        </div>
      )}
    </section>
  )
})

LawyerLegalKnowledge.displayName = 'LawyerLegalKnowledge'

export default LawyerLegalKnowledge
