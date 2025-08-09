import styles from '@/components/legalTermWidget/legal-term-widget.module.scss'
import SvgIcon from '../SvgIcon'
import { useState } from 'react'

type LegalTermWidgetProps = {
  lagalTermList: string[]
}

const LegalTermWidget = ({ lagalTermList }: LegalTermWidgetProps) => {
  const [expanded, setExpanded] = useState(false)
  const visibleList = expanded ? lagalTermList : lagalTermList.slice(0, 5)

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
            {visibleList.map((term, index) => (
              <p key={term + index}>{term}</p>
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
