import Divider from '@/components/divider/Divider'
import SvgIcon from '@/components/SvgIcon'
import styles from './lawyerLegalKnowledge.module.scss'
import { useGetKnowledgeList } from '@/hooks/queries/useGetKnowledgeList'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import { forwardRef } from 'react'

const LawyerLegalKnowledge = forwardRef<HTMLElement>((_, ref) => {
  const {
    data: knowledgeList,
    isLoading: _isLoading,
    isError: _isError,
  } = useGetKnowledgeList({
    subcategoryId: 4,
    take: 4,
    orderBy: 'createdAt',
  })

  const threeLegalKnowledgeList = knowledgeList.slice(0, 3)

  console.log(threeLegalKnowledgeList)

  return (
    <section ref={ref} className={styles['lawyer-legal-knowledge']} aria-label='변호사의 법률 지식'>
      <header className={styles['lawyer-legal-knowledge__header']}>
        <h3 className={styles['lawyer-legal-knowledge__title']}>변호사의 법률 지식</h3>
        <button
          type='button'
          className={styles['lawyer-legal-knowledge__button']}
          aria-label='변호사의 법률 지식 더보기'
        >
          더보기
          <SvgIcon name='arrowSmall' className={styles['lawyer-legal-knowledge__button-icon']} size={14} />
        </button>
      </header>
      <Divider padding={14} />
      <ul className={styles['lawyer-legal-knowledge__list']} role='list'>
        {threeLegalKnowledgeList.map((knowledge, index) => (
          <li key={knowledge.knowledgeId}>
            <LegalKnowledgeItem
              title={knowledge.knowledgeTitle}
              description={knowledge.summaryContent}
              isLastAnswer={false}
            />
            {index !== threeLegalKnowledgeList.length - 1 && (
              <Divider padding={24} className={styles['lawyer-legal-knowledge__divider']} />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
})

LawyerLegalKnowledge.displayName = 'LawyerLegalKnowledge'

export default LawyerLegalKnowledge
