import styles from '@/components/legalTermWidget/legal-term-widget.module.scss'
import SvgIcon from '../SvgIcon'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RecommendationLegalTerm } from '@/types/recommendationTypes'

type LegalTermWidgetProps = {
  lagalTermList: RecommendationLegalTerm[] | []
}

const LegalTermWidget = ({ lagalTermList }: LegalTermWidgetProps) => {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const visibleList = expanded ? lagalTermList : lagalTermList.slice(0, 5)

  const handleLegalTermClick = (termId: number) => {
    navigate(`/legal-dictionary/${termId}`)
  }

  return (
    <div className={styles['legal-term-widget']}>
      <h1>법률 용어</h1>
      {lagalTermList.length === 0 ? (
        <div className={styles['empty-state']}>
          <p>
            컨텐츠에 포함된 <br />
            법률 용어가 없습니다.
          </p>
        </div>
      ) : (
        <>
          <div className={styles['tag-list']}>
            {visibleList.map(term => (
              <p key={term.legalTermId} onClick={() => handleLegalTermClick(term.legalTermId)}>
                {term.koreanName} ({term.chineseName})
              </p>
            ))}
          </div>
          {!expanded && lagalTermList.length > 5 && (
            <button onClick={() => setExpanded(true)}>
              <span>더보기</span>
              <SvgIcon name='arrowSmall' />
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default LegalTermWidget
