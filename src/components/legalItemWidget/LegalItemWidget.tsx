import { useState } from 'react'
import Divider from '../divider/Divider'
import SvgIcon from '../SvgIcon'
import styles from './legal-item-widget.module.scss'
import { LegalTermItem } from '@/types/legalTermTypes'

interface LegalItemWidgetProps {
  title: string
  legalTermList: LegalTermItem[]
  onRefresh?: () => void
}

const LegalItemWidget = ({ title, legalTermList, onRefresh }: LegalItemWidgetProps) => {
  const [showAll, setShowAll] = useState(false)

  const displayItems = showAll ? legalTermList : legalTermList.slice(0, 5)
  const hasMore = legalTermList.length > 5

  return (
    <section className={styles.container}>
      <div className={styles['header']}>
        <h3 className={styles['title']}>{title}</h3>
        <SvgIcon name='refresh' onClick={onRefresh} />
      </div>
      <Divider padding={16} />
      <div className={styles['content']}>
        {!legalTermList || legalTermList.length === 0 ? (
          <div className={styles['empty-state']}>
            <p className={styles['empty-text']}>표시할 법률 용어가 없습니다.</p>
          </div>
        ) : (
          <>
            {displayItems.map(item => (
              <div className={styles['item']} key={item.legalTermId}>
                <h4 className={styles['item-title']}>
                  {item.koreanName} [{item.chineseName}]
                </h4>
              </div>
            ))}
            {/* {hasMore && (
              <button 
                className={styles['show-more-button']} 
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? '접기' : `더보기 (${legalTermList.length - 5}개 더)`}
              </button>
            )} */}
          </>
        )}
      </div>
    </section>
  )
}

export default LegalItemWidget
