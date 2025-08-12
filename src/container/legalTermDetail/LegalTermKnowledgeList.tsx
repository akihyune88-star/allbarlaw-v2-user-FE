import styles from './legal-term-list.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { Fragment } from 'react/jsx-runtime'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Divider from '@/components/divider/Divider'
import { KnowledgeItem } from '@/types/knowledgeType'
import EmptyState from '@/components/EmptyState/EmptyState'
import { useNavigate } from 'react-router-dom'
import { useSearchStore } from '@/stores/searchStore'

const LegalTermKnowledgeList = ({
  knowledgeList,
  termsName,
}: {
  knowledgeList: KnowledgeItem[]
  termsName: string
}) => {
  const isMobile = useMediaQuery('(max-width: 80rem)')
  const { setSearchQuery, setSearchLawyerId } = useSearchStore()
  const navigate = useNavigate()

  const handleMore = () => {
    setSearchQuery(termsName)
    setSearchLawyerId(undefined)
    navigate(`/search/legal-knowledge`)
  }

  return (
    <div className={styles.container}>
      <header className={`${styles['list-header']} ${styles['knowledge']}`}>
        <h3>법률 지식인</h3>
        {knowledgeList.length > 0 && (
          <button onClick={handleMore}>
            <span>더보기</span>
            <SvgIcon name='arrowSmall' style={{ transform: 'rotate(-90deg)' }} />
          </button>
        )}
      </header>
      {!isMobile && knowledgeList.length > 0 && <Divider padding={24} />}
      <section className={styles['list-section']} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {knowledgeList.length === 0 ? (
          <EmptyState message='등록된 법률 지식인 글이 없습니다.' />
        ) : (
          knowledgeList.map((knowledge, index) => (
            <Fragment key={knowledge.knowledgeId}>
              <LegalKnowledgeItem
                knowledgeId={knowledge.knowledgeId}
                title={knowledge.knowledgeTitle}
                description={knowledge.summaryContent}
                time={new Date(knowledge.lastMessageAt)}
                lawyerList={knowledge.lawyers}
                isLastAnswer={true}
                knowledgeKeep={knowledge.isKeep}
              />
              {index !== knowledgeList.length - 1 && <Divider padding={0} />}
            </Fragment>
          ))
        )}
      </section>
    </div>
  )
}

export default LegalTermKnowledgeList
